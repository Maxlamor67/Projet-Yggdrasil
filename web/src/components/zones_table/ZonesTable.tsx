import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";
import type { GetGeometryResponse } from "@/api";

import { ZonesTableRow } from "./ZonesTableRow";
import { ZonesEditSheet } from "./ZonesEditSheet";

export function ZonesTable({ 
  projectId,
  selectedAreaId,
  onSelectArea
}: { 
  projectId: string;
  selectedAreaId?: string | null;
  onSelectArea?: (id: string) => void;
}) {
  const queryClient = useQueryClient();  const { showError } = useError();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<GetGeometryResponse | null>(null);

  // Utiliser React Query pour récupérer les zones
  const { data: geometriesResponse } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["geometries", projectId],
      queryFn: () => api.geometry.geometryControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetGeometries",
    "Impossible de charger les géométries"
  );

  const geometries: GetGeometryResponse[] = (geometriesResponse?.data ?? []) as GetGeometryResponse[];
  
  const data = geometries
    .filter((g) => g.type === "AREA")
    .sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    });

  function handleEdit(id: string) {
    const z = data.find((x) => x.id === id);
    if (!z) return;
    setSelected(z);
    setSheetOpen(true);
  }

  // Mutation pour supprimer une zone avec invalidation des queries
  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      api.geometry.geometryControllerRemoveV2(projectId, id),
    onSuccess: async () => {
      // Invalider la query des géométries pour mettre à jour la carte
      await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });
      toast.success("Zone supprimée avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteArea");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer la zone"
      );
      showError(errorInfo);
    },
  });

  async function handleSave(updated: GetGeometryResponse) {
    // Invalider les queries après mise à jour
    await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });
  }

  function handleView(id: string) {
    alert(`Voir la zone sur la carte: ${id}`);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end gap-4">
          <Select disabled>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtres à venir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableHead>Nom</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableHeader>

          <TableBody>
            {data.map((z) => (
              <ZonesTableRow
                key={z.id}
                zone={z}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSelected={selectedAreaId === z.id}
                onSelect={onSelectArea ? () => onSelectArea(z.id) : undefined}
                onDeselect={onSelectArea ? () => onSelectArea("") : undefined}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <ZonesEditSheet
        projectId={projectId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        zone={selected}
        onSave={handleSave}
      />
    </>
  );
}
