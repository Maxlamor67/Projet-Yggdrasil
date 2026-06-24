import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type {LatLngTuple} from "leaflet";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import type {CreateAttentionPointDto, CreatePointDto} from "@/api";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

export default function AttentionPointCreationForm({
    pointDto,
    setNewAttentionPointPosition,
    setDrawingMode,
    projectId,
  }: {
    pointDto: CreatePointDto
    setNewAttentionPointPosition: (p: LatLngTuple | null) => void;
    setDrawingMode: (mode: string | null) => void;
    projectId: string;
}) {
    const queryClient = useQueryClient();
    const formRef = useRef<HTMLFormElement>(null);
    const { showError } = useError();

    const handleFinish = () => {
        setNewAttentionPointPosition(null);
        setDrawingMode(null);
    };

    const createAttentionPointMutation = useMutation({
        mutationFn: async (payload: CreateAttentionPointDto) => {
            return api.attentionPoint.attentionPointControllerCreateV2(
                projectId,
                payload
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["attentionPoints", projectId],
            });
            handleFinish();
        },
        onError: (error) => {
            logError(error, "CreateAttentionPoint");
            showError(processAxiosError(error, "Impossible de créer le point d'attention"));
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const dto: CreateAttentionPointDto = {
            description: form.get("description") as string,
            point: pointDto
        };

        await createAttentionPointMutation.mutateAsync(dto);
    };

    return (
        <Card className="flex flex-col gap-2 shadow-xl border-0 p-0">
            <CardTitle className="bg-black text-white text-center rounded-t-lg px-6 py-2">
                Création d&apos;un point d&apos;attention
            </CardTitle>

            <CardContent className="px-4 py-1">
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className='flex flex-col gap-1'>
                        <Label>Description</Label>
                        <Input name="description" />
                    </div>

                    <div className="flex gap-2">
                        <Button variant={"outline"} className="w-1/2 cursor-pointer" onClick={handleFinish}>
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
