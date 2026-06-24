import {View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert} from 'react-native'
import {useState} from "react";
import {getSoftwareBaseUrl, useSoftwareStore} from "../../contexts/SoftwareProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "../../lib/api";
import {db} from "../../db/client";
import {
    geometries,
    geometryPoints,
    points,
    pointsToSecure, pointToSecurePhotos,
    projects,
    safetyEquipmentTypeLengths,
    safetyEquipmentTypes, schedulePointPointers, schedulePoints, schedules
} from "../../db/schema";
import {eq} from "drizzle-orm";
import {useRouter} from "expo-router";
import {inArray} from "drizzle-orm/sql/expressions/conditions";
import {useProjectStore} from "../../store/projectStore";
import * as FileSystem from 'expo-file-system';
import {Buffer} from "buffer";
import axios from "axios";
import {processAxiosError} from "../../lib/utils";

const SoftwareConnect = () => {
    const { software } = useSoftwareStore();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [teams, setTeams] = useState<{id: string, name: string}[]>([]);
    const [step, setStep] = useState<
        | 'CONNECTING'
        | 'SENDING'
        | 'RECEIVING'
        | 'RECEIVING_PLANNING'
        | 'WAITING_FOR_TEAM_SELECTION'
        | 'DONE'
    >('CONNECTING');
    const { project } = useProjectStore();

    const preparePhotos = async (rawPhotos: { data: Uint8Array<ArrayBufferLike>, mimeType: string }[], pointToSecureIndex: number) => {
        const photos: any[] = [];

        for (let i = 0; i < rawPhotos.length; i++) {
            const rawPhoto = rawPhotos[i];

            const extension = rawPhoto.mimeType.split('/')[1] || 'jpg';
            const filename = `file_${pointToSecureIndex}_${i}.${extension}`;
            const fileUri = `${FileSystem.Paths.cache.uri}${filename}`;

            const base64Data = Buffer.from(rawPhoto.data).toString('base64');

            new FileSystem.File(fileUri).write(base64Data);

            photos.push({
                uri: fileUri,
                name: filename,
                type: rawPhoto.mimeType,
            });
        }

        return photos;
    };

    const exportDataMutation = useMutation({
        mutationFn: async () => {
            try {
                if (!project) {
                    router.replace('/(app)');
                    return null;
                }

                const allPointsToSecureRaw = await db.query.pointsToSecure.findMany({
                    where: eq(pointsToSecure.projectId, project.id),
                    with: {
                        point: true,
                    }
                });
                const allPointToSecurePhotos = await db.query.pointToSecurePhotos.findMany({
                    where: inArray(pointToSecurePhotos.pointToSecureId, allPointsToSecureRaw.map(p => p.id)),
                });

                const allPointsToSecure = allPointsToSecureRaw.map((pointToSecure, index) => {
                    return {
                        details: {
                            safetyEquipmentTypeId: pointToSecure.safetyEquipmentTypeId,
                            point: {
                                latitude: pointToSecure.point?.latitude!,
                                longitude: pointToSecure.point?.longitude!,
                            },
                            comment: pointToSecure.comment,
                            index,
                        },
                        photos: allPointToSecurePhotos.map(photo => {
                            if (photo.pointToSecureId === pointToSecure.id) {
                                return {
                                    data: photo.data,
                                    mimeType: photo.mimeType,
                                };
                            } else {
                                return null;
                            }
                        }).filter(photo => photo !== null),
                    };
                });

                const allPreparedPhotos = await Promise.all(allPointsToSecure.map(async (pointToSecure, index) => {
                    return await preparePhotos(pointToSecure.photos, index);
                }));

                const formData = new FormData();

                formData.append('data', JSON.stringify({
                    pointsToSecure: allPointsToSecure.map((pts) => pts.details),
                }));

                const flatPhotos = allPreparedPhotos.flat();

                flatPhotos.forEach((photo) => {
                    // @ts-ignore
                    formData.append('photos', {
                        uri: photo.uri,
                        name: photo.name,
                        type: photo.type,
                    });
                });

                const url = `/v2/projects/${project.id}/transfers/${software.transferId}/import`;

                const response = await axios.post(url, formData, {
                    baseURL: getSoftwareBaseUrl()!,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                });

                return response.data;
            } catch (error) {
                processAxiosError(error, 'Une erreur est survenue.', [{
                    style: 'default',
                    onPress: () => {
                        if (router.canGoBack()) {
                            router.back();
                            return;
                        }
                        router.replace('/(app)');
                    }
                }]);
                return null;
            }
        },
    });

    const importPlanningMutation = useMutation({
        mutationFn: async (teamId: string) => {
            try {
                setStep('CONNECTING');
                const importPlanning = await api.transfer.transferControllerExportPlanningDataV2(software.projectId!, software.transferId!, teamId, {
                    baseURL: getSoftwareBaseUrl()!,
                });
                if (!importPlanning.data) return;

                const transfer = importPlanning.data;
                setStep('RECEIVING_PLANNING');
                await db.transaction(async (tx) => {
                    await tx.insert(projects).values({
                        id: transfer.id,
                        name: transfer.name,
                        type: 'SOFTWARE_TO_APP_PLANNING',
                    });

                    let promises = transfer.safetyEquipments.map(async (safetyEquipment) => {
                        await tx.insert(safetyEquipmentTypes).values({
                            id: safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType.id,
                            name: safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType.name,
                            model: safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType.model,
                        }).onConflictDoNothing();
                        return tx.insert(safetyEquipmentTypeLengths).values({
                            id: safetyEquipment.safetyEquipmentTypeLength.id,
                            length: safetyEquipment.safetyEquipmentTypeLength.length,
                            safetyEquipmentTypeId: safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType.id,
                        }).onConflictDoNothing();
                    });
                    await Promise.all(promises);

                    transfer.safetyEquipments.map(async (safetyEquipment) => {
                        const [createdPointer] = await tx.insert(schedulePointPointers).values({}).returning();
                        const schedulePointsPromises = safetyEquipment.safetyEquipmentPoints.map(async (schedulePoint) => {
                            const [createdPoint] = await tx.insert(points).values({
                                latitude: schedulePoint.point.latitude,
                                longitude: schedulePoint.point.longitude,
                            }).returning();
                            return tx.insert(schedulePoints).values({
                                schedulePointPointerId: createdPointer.id,
                                rank: schedulePoint.rank,
                                pointId: createdPoint.id,
                            });
                        });
                        const schedulePromises = safetyEquipment.actions.map((action, i) => {
                            return tx.insert(schedules).values({
                                id: `${safetyEquipment.id}-${i}`,
                                projectId: transfer.id,
                                safetyEquipmentTypeLengthId: safetyEquipment.safetyEquipmentTypeLength.id,
                                schedulePointPointerId: createdPointer.id,
                                quantity: safetyEquipment.safetyEquipmentTypeLengthCount,
                                actionType: action.type,
                                actionAt: action.realizedAt,
                            });
                        });
                        await Promise.all([schedulePointsPromises, schedulePromises].flat());
                    });
                });
                await queryClient.invalidateQueries({ queryKey: ['getFirstProject'] });
                setStep('DONE');
                router.replace('/(app)');
            } catch (error) {
                processAxiosError(error, 'Une erreur est survenue.', [{
                    style: 'default',
                    onPress: () => {
                        if (router.canGoBack()) {
                            router.back();
                            return;
                        }
                        router.replace('/(app)');
                    }
                }]);
                return null;
            }
        },
    });

    const joinTransferQuery = useQuery({
        queryKey: ['joinTransfer', software.transferId],
        queryFn: async () => {
            try {
                const projectId = software.projectId || project?.id || '';
                const joinTransfer = await api.transfer.transferControllerJoinTransferV2(projectId, software.transferId!, {
                    baseURL: getSoftwareBaseUrl()!,
                });
                if (!joinTransfer.data) return null;

                const transfer = joinTransfer.data.data!;
                switch (joinTransfer.data.type) {
                    case 'SOFTWARE_TO_APP':
                        setStep('RECEIVING');
                        if (project?.id) {
                            Alert.alert('Erreur', 'Un projet est déjà ouvert dans l’application. Veuillez le fermer avant d’importer un nouveau projet depuis le logiciel.', [{
                                style: 'default',
                                onPress: () => {
                                    if (router.canGoBack()) {
                                        router.back();
                                        return;
                                    }
                                    router.replace('/(app)/(map)');
                                }
                            }]);
                            return null;
                        }
                        await db.transaction(async (tx) => {
                            await tx.insert(projects).values({
                                id: transfer.project?.details.id!,
                                name: transfer.project?.details.name!,
                                type: 'SOFTWARE_TO_APP',
                            });

                            const promises = transfer.project?.safetyEquipmentTypes.map((safetyEquipmentType) => {
                                return tx.insert(safetyEquipmentTypes).values({
                                    id: safetyEquipmentType.id,
                                    name: safetyEquipmentType.name,
                                    model: safetyEquipmentType.model,
                                });
                            }) || [];
                            await Promise.all(promises);

                            transfer.project?.details.geometries.map(async (geometry) => {
                                const [createdGeometry] = await tx.insert(geometries).values({
                                    projectId: geometry.projectId,
                                    name: geometry.name,
                                    type: geometry.type,
                                }).returning();
                                geometry.geometryPoints.map(async (geometryPoint) => {
                                    const [createdPoint] = await tx.insert(points).values({
                                        latitude: geometryPoint.point.latitude,
                                        longitude: geometryPoint.point.longitude,
                                    }).returning();
                                    await tx.insert(geometryPoints).values({
                                        geometryId: createdGeometry.id,
                                        pointId: createdPoint.id,
                                        rank: geometryPoint.rank,
                                    });
                                })
                            });
                        });
                        await queryClient.invalidateQueries({queryKey: ['getFirstProject']});
                        setStep('DONE');
                        router.replace('/(app)');
                        break;
                    case 'SOFTWARE_TO_APP_PLANNING':
                        if (project?.id) {
                            Alert.alert('Erreur', 'Un projet est déjà ouvert dans l’application. Veuillez le fermer avant d’importer un nouveau planning depuis le logiciel.', [{
                                style: 'default',
                                onPress: () => {
                                    if (router.canGoBack()) {
                                        router.back();
                                        return;
                                    }
                                    router.replace('/(app)/(map)');
                                }
                            }]);
                            return null;
                        }
                        setTeams(transfer?.teams || []);
                        setStep('WAITING_FOR_TEAM_SELECTION');
                        break;
                    case 'APP_TO_SOFTWARE':
                        if (!project?.id) {
                            Alert.alert('Erreur', 'Aucun projet ouvert dans l’application. Veuillez ouvrir un projet avant d’exporter des données vers le logiciel.', [{
                                style: 'default',
                                onPress: () => {
                                    if (router.canGoBack()) {
                                        router.back();
                                        return;
                                    }
                                    router.replace('/(app)');
                                }
                            }]);
                            return null;
                        }
                        setStep('SENDING');
                        await exportDataMutation.mutateAsync();
                        setStep('DONE');
                        router.replace('/(app)/(map)');
                        break;
                }
                return joinTransfer.data.type;
            } catch (error) {
                processAxiosError(error, 'Une erreur est survenue.', [{
                    style: 'default',
                    onPress: () => {
                        if (router.canGoBack()) {
                            router.back();
                            return;
                        }
                        router.replace('/(app)');
                    }
                }]);
                return null;
            }
        },
    });

    {/* Texte dynamique affiché */}
    const getLabel = () => {
        switch (step) {
            case 'CONNECTING':
                return 'Connexion au logiciel…';
            case 'SENDING':
                return 'Envoi des données vers le logiciel…';
            case 'RECEIVING':
                return 'Réception des données depuis le logiciel…';
            case 'RECEIVING_PLANNING':
                return 'Réception du planning depuis le logiciel…';
            case 'WAITING_FOR_TEAM_SELECTION':
                return 'En attente de la sélection de l’équipe…';
            case 'DONE':
                return 'Transfert terminé !';
            default:
                return '';
        }
    };
    const isWaitingForSelection = step === 'WAITING_FOR_TEAM_SELECTION';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* On cache le spinner si on attend une action utilisateur */}
                {!isWaitingForSelection && <ActivityIndicator size="large" color="#ffffff" />}
                <Text style={styles.headerText}>{getLabel()}</Text>
            </View>

            <View style={styles.footer}>
                {isWaitingForSelection ? (
                    <View style={styles.selectionContainer}>
                        <Text style={styles.footerTitle}>Qui êtes-vous ?</Text>
                        <Text style={styles.footerDescription}>
                            Veuillez sélectionner l&apos;équipe pour laquelle récupérer le planning.
                        </Text>
                        <ScrollView style={styles.teamList} contentContainerStyle={styles.teamListContent}>
                            {teams.map((team) => (
                                <TouchableOpacity
                                    key={team.id}
                                    style={styles.teamButton}
                                    onPress={() => importPlanningMutation.mutate(team.id)}
                                >
                                    <Text style={styles.teamButtonText}>{team.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ) : (
                    <View>
                        <Text style={styles.footerTitle}>Transfert en cours</Text>
                        <Text style={styles.footerDescription}>
                            Veuillez patienter pendant que l’application communique avec le logiciel.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default SoftwareConnect;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171C22',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        marginTop: 15,
        fontSize: 20,
        fontWeight: '600',
    },
    footer: {
        flex: 3,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 40,
        paddingHorizontal: 30,
    },
    selectionContainer: {
        flex: 1,
    },
    footerTitle: {
        color: '#05375a',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footerDescription: {
        color: 'grey',
        marginBottom: 20,
    },
    teamList: {
        flex: 1,
    },
    teamListContent: {
        paddingBottom: 20,
    },
    teamButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    teamButtonText: {
        color: '#171C22',
        fontWeight: '600',
        fontSize: 16,
    },
});