import { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";

import type { LatLngTuple } from "leaflet";
import type {
  GetAllPointsToSecureResponse as PointToSecure,
  GetSafetyEquipmentTypeResponse,
  UpdatePointToSecureDto,
} from "@/api";

import { PointsTableRow } from "./PointsTableRow";
import { PointsEditSheet } from "./PointEditSheet";

type Props = {
  projectId: string;
  selectedPoint: PointToSecure | null;
  setSelectedPoint: (p: PointToSecure | null) => void;
  onViewPosition: (pos: LatLngTuple) => void;
  statusFilter: "all" | "traite" | "non_traite";
  onStatusFilterChange: (filter: "all" | "traite" | "non_traite") => void;
};

export function PointsTable({
  projectId,
  selectedPoint,
  setSelectedPoint,
  onViewPosition,
  statusFilter,
  onStatusFilterChange,
}: Props) {
  const queryClient = useQueryClient();
  const { showError } = useError();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetPointId, setSheetPointId] = useState<string | null>(null);

  /** Types d’équipements (pour le select) */
  const { data: typesRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentTypes"],
      queryFn: () => api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2(),
      retry: 0,
    }),
    "GetSafetyEquipmentTypes",
    "Impossible de charger les types d'équipements"
  );
  const safetyEquipmentTypes: GetSafetyEquipmentTypeResponse[] =
    (typesRes?.data ?? []) as GetSafetyEquipmentTypeResponse[];

  /** Liste points */
  const { data: listRes, isLoading } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["pointsToSecure", projectId],
      queryFn: () => api.pointToSecure.pointToSecureControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetPointsToSecure",
    "Impossible de charger les points à sécuriser"
  );

  const rawPoints: PointToSecure[] = (listRes?.data ?? []) as PointToSecure[];

  const points = useMemo(() => {
    if (statusFilter === "all") return rawPoints;
    if (statusFilter === "traite") return rawPoints.filter((p) => p.isTreated);
    return rawPoints.filter((p) => !p.isTreated);
  }, [rawPoints, statusFilter]);

  /** Delete */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      api.pointToSecure.pointToSecureControllerRemoveV2(projectId, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pointsToSecure", projectId] });
      // si on supprime celui sélectionné
      if (selectedPoint && sheetPointId === selectedPoint.id) {
        setSelectedPoint(null);
      }
      toast.success("Point supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeletePoint");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer le point"
      );
      showError(errorInfo);
    },
  });

  /** Update */
  const updateMutation = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdatePointToSecureDto }) =>
      api.pointToSecure.pointToSecureControllerUpdateV2(projectId, id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pointsToSecure", projectId] });
      if (sheetPointId) {
        await queryClient.invalidateQueries({ queryKey: ["pointToSecure", projectId, sheetPointId] });
      }
      toast.success("Point modifié avec succès");
    },
    onError: (error) => {
      logError(error, "UpdatePoint");
      const errorInfo = processAxiosError(
        error,
        "Impossible de modifier le point"
      );
      showError(errorInfo);
    },
  });

  function handleView(p: PointToSecure) {
    setSelectedPoint(p);
    onViewPosition([p.point.latitude, p.point.longitude]);
  }

  function handleEdit(p: PointToSecure) {
    setSelectedPoint(p);
    setSheetPointId(p.id);
    setSheetOpen(true);
  }

  function handleDelete(p: PointToSecure) {
    // tu peux ajouter un confirm si tu veux
    deleteMutation.mutate(p.id);
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filtres */}
        <div className="flex justify-end gap-4">
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              onStatusFilterChange(v as "all" | "traite" | "non_traite")
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les points</SelectItem>
              <SelectItem value="non_traite">Non traités</SelectItem>
              <SelectItem value="traite">Traités</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Type équipement</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <td colSpan={4} className="p-4 text-sm text-muted-foreground">
                  Chargement...
                </td>
              </TableRow>
            ) : (
              points.map((p) => (
                <PointsTableRow
                  key={p.id}
                  point={p}
                  isSelected={selectedPoint?.id === p.id}
                  onSelect={() => handleView(p)}
                  onDeselect={() => setSelectedPoint(null)}
                  onEdit={() => handleEdit(p)}
                  onDelete={() => handleDelete(p)}
                  // update rapide "traité" possible depuis la ligne si tu veux
                  onToggleTreated={(next) =>
                    updateMutation.mutate({ id: p.id, dto: { isTreated: next } })
                  }
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PointsEditSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        projectId={projectId}
        pointId={sheetPointId}
        safetyEquipmentTypes={safetyEquipmentTypes}
        onSave={(dto) => {
          if (!sheetPointId) return;
          updateMutation.mutate({ id: sheetPointId, dto });
        }}
      />
    </>
  );
}
