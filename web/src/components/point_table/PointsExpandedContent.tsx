import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MessageSquare, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";

import type {
  GetAllPointsToSecureResponse as PointToSecure,
  GetPointToSecureResponse,
} from "@/api";

type Props = {
  projectId: string;
  pointId: string;
  pointListItem: PointToSecure;

  onEdit: () => void;
  onDelete: () => void;
};

export function PointsExpandedContent({
  projectId,
  pointId,
  pointListItem,
  onEdit,
  onDelete,
}: Props) {
  const { data: detailsRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["pointToSecure", projectId, pointId],
      queryFn: () =>
        api.pointToSecure.pointToSecureControllerFindOneV2(projectId, pointId),
      retry: 0,
    }),
    "GetPointToSecureDetails",
    "Impossible de charger les détails du point"
  );

  const details: GetPointToSecureResponse | undefined = detailsRes?.data;

  const equipmentName = details?.safetyEquipmentType?.name;

  const photos = details?.photos ?? [];

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Commentaire */}
      <div className="flex items-start gap-2">
        <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground" />
        <p className="italic text-sm">
          {pointListItem.comment ? `"${pointListItem.comment}"` : "aucun commentaire"}
        </p>
      </div>

      {/* Équipement */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Équipement :</p>
        {equipmentName ? (
          <Badge>{equipmentName}</Badge>
        ) : (
          <Badge variant="secondary">Aucun</Badge>
        )}
      </div>

      {/* Photos */}
      {photos.length ? (
        <div className="flex gap-2 overflow-x-auto">
          {photos.map((ph) => {
            const src = `${
              import.meta.env.VITE_HTTP_API_URL
            }/v2/projects/${projectId}/points-to-secure/${pointId}/photos/${ph.id}`;

            return (
              <div
                key={ph.id}
                className="h-24 w-24 rounded-md border overflow-hidden bg-muted"
              >
                <img
                  src={src}
                  alt="Photo"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aucune photo associée.</p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onEdit} className="flex items-center gap-2 hover:cursor-pointer">
          <Edit className="w-6 h-4" />
          Modifier
        </Button>

        <Button variant="destructive" onClick={onDelete} className="flex items-center gap-2 hover:cursor-pointer">
          <Trash2 className="w-6 h-4" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}
