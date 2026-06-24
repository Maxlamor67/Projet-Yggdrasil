import {Marker, Popup} from "react-leaflet";
import type {GetAttentionPointsResponse} from "@/api";
import L from "leaflet";
import {renderToString} from "react-dom/server";
import {CircleAlert, Trash2} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import {Button} from "@/components/ui/button";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

export const getAttentionPointIcon = () => {
    return L.divIcon({
        html: renderToString(
            <div className="relative flex items-center justify-center">
                <span className="absolute h-4 w-4 rounded-full bg-amber-400 opacity-30 animate-ping" />
                <div className="relative bg-amber-500 rounded-full p-1 shadow-lg border border-white">
                    <CircleAlert color="white" size={14} strokeWidth={2.5} />
                </div>
            </div>
        ),
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

interface AttentionPointMarkerProps {
    attentionPoint: GetAttentionPointsResponse;
    projectId: string;
}

export default function AttentionPointMarker({ attentionPoint, projectId } : AttentionPointMarkerProps) {
    const queryClient = useQueryClient();
    const { showError } = useError();

    const deleteAttentionPointMutation = useMutation({
        mutationFn: (id: string) =>
            api.attentionPoint.attentionPointControllerRemoveV2(projectId, id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["attentionPoints", projectId] }),
        onError: (error) => {
            logError(error, "DeleteAttentionPoint");
            showError(processAxiosError(error, "Impossible de supprimer le point d'attention"));
        },
    });

    function handleDelete() {
        deleteAttentionPointMutation.mutate(attentionPoint.id);
    }

    return (
        <Marker
            position={[
                attentionPoint.point.latitude,
                attentionPoint.point.longitude,
            ]}
            icon={getAttentionPointIcon()}
        >
            <Popup>
                <div className="flex flex-col gap-2 max-w-64">
                    <div className="flex items-center gap-4">
                        <CircleAlert className="text-amber-500 shrink-0" size={28} />
                        <p className="text-sm text-gray-600">
                            {attentionPoint.description || <span className="italic text-gray-400">Aucune description</span>}
                        </p>
                    </div>
                    <div className="flex justify-end ">
                        <Button
                            onClick={handleDelete}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 hover:cursor-pointer"
                        >
                            <Trash2 size={12} />
                            Supprimer
                        </Button>
                    </div>
                </div>
            </Popup>

        </Marker>
    )
}