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

import { ParcoursTableRow } from "./ParcoursTableRow";
import { ParcoursEditSheet } from "./ParcoursEditSheet";

export function ParcoursTable({ 
  projectId,
  selectedCourseId,
  onSelectCourse
}: { 
  projectId: string;
  selectedCourseId?: string | null;
  onSelectCourse?: (id: string) => void;
}) {
  const queryClient = useQueryClient();  const { showError } = useError();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<GetGeometryResponse | null>(null);

  // Utiliser React Query pour récupérer les parcours
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
    .filter((g) => g.type === "ROUTE" && !!g.route)
    .sort((a, b) => {
      const da = new Date(a.route!.startAt).getTime();
      const db = new Date(b.route!.startAt).getTime();
      return db - da;
    });

  function handleEdit(id: string) {
    const p = data.find((x) => x.id === id);
    if (!p) return;
    setSelected(p);
    setSheetOpen(true);
  }

  // Mutation pour supprimer un parcours avec invalidation des queries
  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      api.geometry.geometryControllerRemoveV2(projectId, id),
    onSuccess: async () => {
      // Invalider la query des géométries pour mettre à jour la carte
      await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });
      toast.success("Parcours supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteRoute");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer le parcours"
      );
      showError(errorInfo);
    },
  });

  async function handleSave(updated: GetGeometryResponse) {
    // Invalider les queries après mise à jour
    await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });
  }

  function handleView(id: string) {
    alert(`Voir le parcours sur la carte: ${id}`);
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
            <TableHead>Début</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableHeader>

          <TableBody>
            {data.map((p) => (
              <ParcoursTableRow
                key={p.id}
                parcours={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSelected={selectedCourseId === p.id}
                onSelect={onSelectCourse ? () => onSelectCourse(p.id) : undefined}
                onDeselect={onSelectCourse ? () => onSelectCourse("") : undefined}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <ParcoursEditSheet
        projectId={projectId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        parcours={selected}
        onSave={handleSave}
      />
    </>
  );
}
