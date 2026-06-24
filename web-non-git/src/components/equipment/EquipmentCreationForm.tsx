import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useRef, useState} from "react";
import type {Equipment} from "@/types/geometry.ts";
import type { LatLngTuple } from "leaflet";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import type {CreateSafetyEquipmentDto} from "@/api";
import {SelectEquipe} from "@/components/SelectEquipe.tsx";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

interface EquipmentCreationFormProps {
    newEquipment: Equipment | null;
    selectedSafetyEquipmentTypeLengthId: string | null;
    projectId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function EquipmentCreationForm({
    newEquipment,
    onCancel,
    onSuccess,
    projectId,
    selectedSafetyEquipmentTypeLengthId
}: EquipmentCreationFormProps) {
    // ✅ Check AVANT les hooks
    if (!newEquipment) return null;

    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();
    const { showError } = useError();
    const [setTeamId, setSetTeamId] = useState<string>();
    const [unsetTeamId, setUnsetTeamId] = useState<string>();

    const createSafetyEquipmentMutation = useMutation({
        mutationFn: async (payload: CreateSafetyEquipmentDto) => {
            return api.safetyEquipment.safetyEquipmentControllerCreateV2(
                projectId,
                payload
            );
        },
        onSuccess: () => {
            onSuccess();
        },
        onError: (error) => {
            logError(error, "CreateSafetyEquipment");
            showError(processAxiosError(error, "Impossible de créer l'équipement de sécurité"));
        },
    });

    if (!newEquipment) return;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedSafetyEquipmentTypeLengthId || newEquipment.length === 0) return;

        const form = new FormData(e.currentTarget);

        const pointsArray: LatLngTuple[] = Array.isArray(newEquipment[0])
            ? (newEquipment as LatLngTuple[])
            : [newEquipment as LatLngTuple];

        const dto: CreateSafetyEquipmentDto = {
            safetyEquipmentTypeLengthId: selectedSafetyEquipmentTypeLengthId,
            setAt: `${form.get("setDate")}T${form.get("setTime")}`,
            unsetAt: `${form.get("unsetDate")}T${form.get("unsetTime")}`,
            points: pointsArray.map((p, index) => ({
                latitude: p[0],
                longitude: p[1],
                rank: index,
            })),
            setTeamId: setTeamId,
            unsetTeamId: unsetTeamId
        };

        await createSafetyEquipmentMutation.mutateAsync(dto);

        await queryClient.invalidateQueries({
            queryKey: ["safetyEquipments", projectId],
        });
    };

    return (
        <Card className="flex flex-col gap-2 shadow-xl border-0 p-0">
            <CardTitle className="bg-black text-white text-center rounded-t-lg px-6 py-2">
                Création d&apos;un équipement de sécurité
            </CardTitle>

            <CardContent className="px-4 py-1">
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Equipe de pose</Label>
                        <SelectEquipe
                            projectId={projectId}
                            value={setTeamId}
                            onChange={setSetTeamId}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Equipe de retrait</Label>
                        <SelectEquipe
                            projectId={projectId}
                            value={unsetTeamId}
                            onChange={setUnsetTeamId}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Date de pose</Label>
                        <div className="flex gap-2">
                            <Input name="setDate" type="date" className="w-1/2" required />
                            <Input name="setTime" type="time" className="w-1/2" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Date de dépose</Label>
                        <div className="flex gap-2">
                            <Input name="unsetDate" type="date" className="w-1/2" required />
                            <Input name="unsetTime" type="time" className="w-1/2" required />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="w-1/2 cursor-pointer" type="button" onClick={onCancel}>
                            Annuler
                        </Button>
                        <Button
                            className="w-1/2 cursor-pointer"
                            type="submit"
                            disabled={!selectedSafetyEquipmentTypeLengthId || newEquipment.length === 0}
                        >
                            Créer
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
