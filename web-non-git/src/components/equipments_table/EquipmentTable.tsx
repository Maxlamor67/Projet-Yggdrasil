// EquipmentTable.tsx
import { useMemo, useState, useEffect } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { SelectEquipe } from "@/components/SelectEquipe";

import type {
  GetAllSafetyEquipmentsResponse,
  GetSafetyEquipmentTypeResponse,
  UpdateSafetyEquipmentDto,
} from "@/api";

import { EquipmentTableRow } from "./EquipmentTableRow";
import { EquipmentEditSheet } from "./EquipmentEditSheet";

type Props = {
  projectId: string;
  selectedEquipmentId?: string | null;
  onSelectEquipment?: (id: string) => void;
};

export type UiEquipment = {
  id: string;
  safetyEquipmentTypeLengthId: string;
  label: string;
  count: number;

  // ✅ vraies dates métier
  setAt: Date;
  unsetAt: Date;

  // ✅ teams métier
  setTeamId: string | null;
  unsetTeamId: string | null;

  points: Array<{ latitude: number; longitude: number; rank: number }>;
};

type TypeOption = { id: string; label: string };

function buildTypeOptions(types: GetSafetyEquipmentTypeResponse[]): TypeOption[] {
  return (types ?? []).flatMap((t) =>
    (t.lengths ?? []).map((len) => ({
      id: len.id,
      label: `${t.name} — ${len.length}m`,
    }))
  );
}

function mapEquipment(e: GetAllSafetyEquipmentsResponse): UiEquipment {
  const label = `${e.safetyEquipmentTypeLength.safetyEquipmentType.name} — ${e.safetyEquipmentTypeLength.length}m`;

  const points = (e.safetyEquipmentPoints ?? [])
    .slice()
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((p) => ({
      latitude: p.point.latitude,
      longitude: p.point.longitude,
      rank: p.rank ?? 0,
    }));

  // ✅ source of truth : actions[]
  const setAction = (e.actions ?? []).find((a) => a.type === "SET");
  const unsetAction = (e.actions ?? []).find((a) => a.type === "UNSET");

  // fallback “safe” si jamais action manquante (devrait pas arriver si ton backend crée toujours SET+UNSET)
  const setAtIso = setAction?.realizedAt ?? e.createdAt;
  const unsetAtIso = unsetAction?.realizedAt ?? e.updatedAt;

  return {
    id: e.id,
    safetyEquipmentTypeLengthId: e.safetyEquipmentTypeLengthId,
    label,
    count: e.safetyEquipmentTypeLengthCount,

    setAt: new Date(setAtIso),
    unsetAt: new Date(unsetAtIso),

    setTeamId: setAction?.teamId ?? null,
    unsetTeamId: unsetAction?.teamId ?? null,

    points,
  };
}

export function EquipmentTable({ 
  projectId,
  selectedEquipmentId,
  onSelectEquipment
}: Props) {
  const qc = useQueryClient();
  const { showError } = useError();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<UiEquipment | null>(
    null
  );
  
  // État pour la sélection multiple
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<Set<string>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [batchTeamId, setBatchTeamId] = useState<string>("");
  const [batchActionType, setBatchActionType] = useState<"set" | "unset">("set");

  // 1) Types via API
  const typesQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentTypes"],
      queryFn: () => api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2(),
      retry: 0,
    }),
    "GetSafetyEquipmentTypes",
    "Impossible de charger les types d'équipements"
  );

  const typeOptions = useMemo(() => {
    const list = (typesQuery.data?.data ?? []) as GetSafetyEquipmentTypeResponse[];
    return buildTypeOptions(list);
  }, [typesQuery.data]);

  // 2) Equipements via API
  const eqQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipments", projectId],
      queryFn: () =>
        api.safetyEquipment.safetyEquipmentControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetSafetyEquipments",
    "Impossible de charger les équipements"
  );

  const data: UiEquipment[] = useMemo(() => {
    const raw = (eqQuery.data?.data ?? []) as GetAllSafetyEquipmentsResponse[];
    const mapped = raw.map(mapEquipment);

    if (typeFilter === "all") return mapped;
    return mapped.filter((e) => e.safetyEquipmentTypeLengthId === typeFilter);
  }, [eqQuery.data, typeFilter]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.safetyEquipment.safetyEquipmentControllerRemoveV2(projectId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["safetyEquipments", projectId] });
      toast.success("Équipement supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteEquipment");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer l'équipement"
      );
      showError(errorInfo);
    },
  });

  // Mutation pour la mise à jour en batch
  const batchUpdateMutation = useMutation({
    mutationFn: async ({ equipmentIds, teamId, actionType }: { 
      equipmentIds: string[], 
      teamId: string, 
      actionType: "set" | "unset" 
    }) => {
      const promises = equipmentIds.map(async (equipmentId) => {
        const equipment = data.find(eq => eq.id === equipmentId);
        if (!equipment) return;
        
        const updateData: UpdateSafetyEquipmentDto = {
          items: equipment.count,
          points: equipment.points.map(p => ({ 
            latitude: p.latitude, 
            longitude: p.longitude, 
            rank: p.rank 
          })),
          setAt: equipment.setAt.toISOString(),
          unsetAt: equipment.unsetAt.toISOString(),
          setTeamId: actionType === "set" ? teamId : equipment.setTeamId ?? undefined,
          unsetTeamId: actionType === "unset" ? teamId : equipment.unsetTeamId ?? undefined,
        };
        
        return api.safetyEquipment.safetyEquipmentControllerUpdateV2(
          projectId, 
          equipmentId, 
          updateData
        );
      });
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["safetyEquipments", projectId] });
      // Invalidation du cache des équipes pour assurer la cohérence
      qc.invalidateQueries({ queryKey: ["teams", projectId] });
      toast.success(
        `Équipes attribuées avec succès pour ${selectedEquipmentIds.size} équipement(s)`
      );
      setSelectedEquipmentIds(new Set());
      setShowBatchActions(false);
      setBatchTeamId("");
    },
    onError: (error) => {
      logError(error, "BatchUpdateEquipments");
      const errorInfo = processAxiosError(
        error,
        "Une erreur est survenue lors de l'attribution des équipes"
      );
      showError(errorInfo);
    },
  });

  function handleEdit(id: string) {
    const eq = data.find((e) => e.id === id);
    if (!eq) return;
    setSelectedEquipment(eq);
    setSheetOpen(true);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  // Fonctions de gestion de la sélection multiple
  function handleSelectAll() {
    if (selectedEquipmentIds.size === data.length) {
      setSelectedEquipmentIds(new Set());
    } else {
      setSelectedEquipmentIds(new Set(data.map(eq => eq.id)));
    }
  }

  function handleSelectEquipment(equipmentId: string) {
    const newSelected = new Set(selectedEquipmentIds);
    if (newSelected.has(equipmentId)) {
      newSelected.delete(equipmentId);
    } else {
      newSelected.add(equipmentId);
    }
    setSelectedEquipmentIds(newSelected);
  }

  function handleBatchAction() {
    if (!batchTeamId || selectedEquipmentIds.size === 0) {
      toast.error(
        "Veuillez sélectionner une équipe et au moins un équipement"
      );
      return;
    }
    
    batchUpdateMutation.mutate({
      equipmentIds: Array.from(selectedEquipmentIds),
      teamId: batchTeamId,
      actionType: batchActionType,
    });
  }

  // Calculs dérivés pour l'état de sélection
  const isAllSelected = selectedEquipmentIds.size === data.length && data.length > 0;
  const isPartialSelected = selectedEquipmentIds.size > 0 && selectedEquipmentIds.size < data.length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {typeOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBatchActions(!showBatchActions)}
              disabled={selectedEquipmentIds.size === 0}
            >
              Actions groupées ({selectedEquipmentIds.size})
            </Button>
          </div>
        </div>

        {/* Actions groupées */}
        {showBatchActions && selectedEquipmentIds.size > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">
                Attribution d&apos;équipe pour {selectedEquipmentIds.size} équipement(s)
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type d&apos;action</Label>
                  <Select value={batchActionType} onValueChange={(value: "set" | "unset") => setBatchActionType(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="set">Pose</SelectItem>
                      <SelectItem value="unset">Dépose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Équipe responsable</Label>
                  <SelectEquipe
                    projectId={projectId}
                    value={batchTeamId}
                    onChange={setBatchTeamId}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBatchActions(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleBatchAction}
                  disabled={!batchTeamId || batchUpdateMutation.isPending}
                >
                  {batchUpdateMutation.isPending ? "Attribution..." : "Attribuer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(ref) => {
                    if (ref && 'indeterminate' in ref) {
                      (ref as any).indeterminate = isPartialSelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Type d&apos;équipement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((e) => (
              <EquipmentTableRow
                key={e.id}
                equipment={e}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isSelected={selectedEquipmentId === e.id}
                onSelect={onSelectEquipment ? () => onSelectEquipment(e.id) : undefined}
                onDeselect={onSelectEquipment ? () => onSelectEquipment("") : undefined}
                isChecked={selectedEquipmentIds.has(e.id)}
                onCheck={() => handleSelectEquipment(e.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <EquipmentEditSheet
        open={sheetOpen}
        onOpenChange={(v) => {
          setSheetOpen(v);
          if (!v) setSelectedEquipment(null);
        }}
        projectId={projectId}
        equipment={selectedEquipment}
        typeOptions={typeOptions}
        onSaved={() =>
          qc.invalidateQueries({ queryKey: ["safetyEquipments", projectId] })
        }
      />
    </>
  );
}
