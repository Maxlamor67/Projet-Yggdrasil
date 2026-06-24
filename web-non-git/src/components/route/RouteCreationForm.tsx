import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import type {CreateGeometryDto} from "@/api";
import type {LatLngTuple} from "leaflet";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

interface RouteCreationFormProps {
    onFinish: () => void;
    points: LatLngTuple[];
    projectId: string;
}

interface CreateCoursePayload {
    slowerSpeed: number;
    fasterSpeed: number;
    startAt: string;
}

export default function RouteCreationForm({ onFinish, points, projectId }: RouteCreationFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();
    const { showError } = useError();

    const createGeometryMutation = useMutation({
        mutationFn: async ({ slowerSpeed, fasterSpeed, startAt }: CreateCoursePayload) => {
            const nowLabel = new Date().toISOString().slice(0, 16).replace("T", " ");

            const payload: CreateGeometryDto = {
                type: "ROUTE", // "AREA" | "ROUTE"
                name: `Parcours ${nowLabel}`,
                points: points.map((point, index) => {
                    return {
                        latitude: point[0],
                        longitude: point[1],
                        rank: index
                    }
                }),
                route: {
                    startAt: startAt,
                    slowerParticipantSpeedEstimate: slowerSpeed,
                    fasterParticipantSpeedEstimate: fasterSpeed,
                },
            };

            return api.geometry.geometryControllerCreateV2(projectId, payload);
        },
        onSuccess: () => {
            onFinish();
        },
        onError: (error) => {
            logError(error, "CreateGeometry");
            showError(processAxiosError(error, "Impossible de créer le parcours"));
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const slowerSpeed = Number(form.get("slowerSpeed"));
        const fasterSpeed = Number(form.get("fasterSpeed"));

        if (fasterSpeed <= slowerSpeed) {
            alert("La vitesse rapide doit être supérieure à la vitesse lente");
            return;
        }

        const startAt = new Date(`${form.get("startDate")}T${form.get("startTime")}`).toISOString();

        const payload = {
            slowerSpeed: slowerSpeed,
            fasterSpeed: fasterSpeed,
            startAt: startAt,
        }

        await createGeometryMutation.mutateAsync(payload);

        await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });
    };

    return (
        <Card className="flex flex-col gap-2 shadow-xl border-0 p-0">
            <CardTitle className="bg-black text-white text-center rounded-t-lg px-6 py-2">
                Création d&apos;un parcours
            </CardTitle>

            <CardContent className="px-4 py-1">
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label>Date et heure de début</Label>
                        <div className="flex gap-2">
                            <Input name="startDate" type="date" className="w-1/2" required />
                            <Input name="startTime" type="time" className="w-1/2" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Vitesse du participant le plus lent (km/h)</Label>
                        <Input name="slowerSpeed" type="number" min="1" step="0.1" placeholder="Ex: 8" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Vitesse du participant le plus rapide (km/h)</Label>
                        <Input name="fasterSpeed" type="number" min="1" step="0.1" placeholder="Ex: 15" required />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="w-1/2 cursor-pointer" type="button" onClick={onFinish}>
                            Annuler
                        </Button>
                        <Button className="w-1/2 cursor-pointer" type="submit">
                            Créer
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
