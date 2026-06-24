import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useCallback, useRef, useState} from "react";
import {CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {BarcodeScanningResult} from "expo-camera/src/Camera.types";
import {useFocusEffect, useRouter} from "expo-router";
import {z} from "zod/v4";
import {useSoftwareStore} from "../../contexts/SoftwareProvider";
import {Ionicons} from "@expo/vector-icons";
import Button from "../../components/ui/Button";
import {Colors} from "../../constants/theme";

const softwareAddressSchema = z.object({
    ip: z.ipv4(),
    transferId: z.string(),
    projectId: z.string().optional(),
    portHttp: z.number(),
});

const ScanQR = () => {
    const [facing, _] = useState<CameraType>('back');
    const camera = useRef<CameraView>(null);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [permission, requestPermission] = useCameraPermissions();
    const isProcessing = useRef(false);
    const router = useRouter();
    const { setSoftware } = useSoftwareStore();

    useFocusEffect(
        useCallback(() => {
            isProcessing.current = false;
            camera.current?.resumePreview();
            setIsActive(true);

            return () => {
                setIsActive(false);
                camera.current?.pausePreview();
                isProcessing.current = true;
            };
        }, [])
    );

    const handleBarcodeScanned = useCallback(async ({ data }: BarcodeScanningResult) => {
        try {
            if (isProcessing.current) return;
            isProcessing.current = true;
            camera.current?.pausePreview();

            const barcode = JSON.parse(data);
            const parsedSoftwareAddress = softwareAddressSchema.safeParse(barcode);

            if (!parsedSoftwareAddress.success) {
                Alert.alert('Erreur', 'Le code QR scanné est invalide.', [{
                    style: 'default',
                    onPress: () => {
                        isProcessing.current = false;
                    }
                }]);
                camera.current?.resumePreview();
                return;
            }
            setSoftware({
                ip: parsedSoftwareAddress.data.ip,
                transferId: parsedSoftwareAddress.data.transferId,
                httpPort: parsedSoftwareAddress.data.portHttp,
                projectId: parsedSoftwareAddress.data.projectId,
            })
            router.replace(`/(app)/software-connect`);

        } catch (_) {
            Alert.alert('Erreur', 'Le code QR scanné est invalide.', [{
                style: 'default',
                onPress: () => {
                    isProcessing.current = false;
                }
            }]);
            camera.current?.resumePreview();
        }
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <View style={styles.permissionContent}>
                    <Ionicons name="camera-outline" size={64} color={Colors.dark.icon} style={styles.permissionIcon} />
                    <Text style={styles.permissionTitle}>Accès à la caméra requis</Text>
                    <Text style={styles.permissionMessage}>
                        La permission d&apos;utiliser la caméra est nécessaire pour scanner des QR codes.
                    </Text>
                    <Button onPress={requestPermission} title="Autoriser la caméra" variant="primary" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={camera}
                active={isActive}
                style={StyleSheet.absoluteFill}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
                autofocus="on"
            />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.overlayContainer} pointerEvents="none">

                {/* MASK */}
                <View style={styles.maskRow}>
                    <Text style={styles.instructionText}>
                        Placer le QR code dans le cadre
                    </Text>
                </View>
                <View style={styles.maskCenterRow}>
                    <View style={styles.maskSide} />

                    {/* CADRE (transparent inside) */}
                    <View style={styles.frame} />

                    <View style={styles.maskSide} />
                </View>
                <View style={styles.maskRow} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.dark.background,
        padding: 20,
    },
    permissionContent: {
        alignItems: 'center',
        maxWidth: 300,
    },
    permissionIcon: {
        marginBottom: 20,
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionMessage: {
        fontSize: 16,
        color: Colors.dark.icon,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 50,
        backgroundColor: '#0008',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: '700',
    },
    frameContainer: {
        width: 260,
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    instructionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        textAlign: "center",
        paddingTop: '45%',
    },
    maskRow: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: '100%',
    },
    maskCenterRow: {
        flexDirection: 'row',
        height: 260,
    },
    maskSide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    frame: {
        width: 260,
        height: 260,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: 'transparent',
    },
});

export default ScanQR;