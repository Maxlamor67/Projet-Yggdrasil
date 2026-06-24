// EquipmentEditSheet.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateAndTimePicker } from "../DateAndTimePicker";
import { Input } from "@/components/ui/input";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { useError } from "@/contexts/ErrorContext";
import { logError, processAxiosError } from "@/utils/error";
import { api } from "@/lib/api";

import type { UpdateSafetyEquipmentDto, Team } from "@/api";
import type { UiEquipment } from "./EquipmentTable";

type TypeOption = { id: string; label: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectId: string;
  equipment: UiEquipment | null;

  typeOptions: TypeOption[];
  onSaved: () => void;
};

type FormState = {
  safetyEquipmentTypeLengthId: string;
  items: number;

  setAt: Date;
  unsetAt: Date;

  setTeamId: string | null;
  unsetTeamId: string | null;
};

export function EquipmentEditSheet({
  open,
  onOpenChange,
  projectId,
  equipment,
  typeOptions,
  onSaved,
}: Props) {
  const { showError } = useError();
  const [form, setForm] = useState<FormState | null>(null);

  /** ---------- TEAMS ---------- */
  const teamsQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["teams", projectId],
      queryFn: async () => {
        const res = await api.team.teamControllerFindAllV2(projectId);
        return res.data as Team[];
      },
      // Force le refetch quand le modal s'ouvre pour s'assurer d'avoir les données à jour
      refetchOnMount: true,
      // Actualise les données quand la fenêtre reprend le focus
      refetchOnWindowFocus: true,
      retry: 0,
    }),
    "GetTeams",
    "Impossible de charger les équipes"
  );
  // Sécurité : s'assurer que teams est toujours un tableau
  const teams: Team[] = Array.isArray(teamsQuery.data) ? teamsQuery.data : [];
  
  // Refetch des équipes quand le modal s'ouvre
  useEffect(() => {
    if (open && projectId) {
      teamsQuery.refetch();
    }
  }, [open, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!equipment) {
      setForm(null);
      return;
    }

    const initialItems = Math.max(1, Math.round(equipment.count ?? 1));

    setForm({
      safetyEquipmentTypeLengthId: equipment.safetyEquipmentTypeLengthId,
      items: initialItems,

      setAt: equipment.setAt,
      unsetAt: equipment.unsetAt,

      setTeamId: equipment.setTeamId ?? null,
      unsetTeamId: equipment.unsetTeamId ?? null,
    });
  }, [equipment]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!equipment || !form) return;

      const dto: UpdateSafetyEquipmentDto = {
        items: form.items,
        setAt: form.setAt.toISOString(),
        unsetAt: form.unsetAt.toISOString(),

        points: equipment.points.map((p) => ({
          latitude: p.latitude,
          longitude: p.longitude,
          rank: p.rank,
        })),

        ...(form.setTeamId ? { setTeamId: form.setTeamId } : {}),
        ...(form.unsetTeamId ? { unsetTeamId: form.unsetTeamId } : {}),
      };

      await api.safetyEquipment.safetyEquipmentControllerUpdateV2(
        projectId,
        equipment.id,
        dto
      );
    },
    onSuccess: () => {
      onSaved();
      onOpenChange(false);
    },
    onError: (error) => {
      logError(error, "UpdateEquipment");
      showError(processAxiosError(error, "Impossible de modifier l'équipement"));
    },
  });

  if (!equipment || !form) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier l&apos;équipement</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          {/* TYPE */}
          <div className="grid gap-3">
            <Label>Type</Label>
            <div className="px-3 py-2 border rounded bg-muted text-muted-foreground">
              {
                typeOptions.find((opt) => opt.id === form.safetyEquipmentTypeLengthId)
                  ?.label || "Type inconnu"
              }
            </div>
          </div>

          {/* TEAM SET */}
          <div className="grid gap-3">
            <Label>Équipe responsable (pose)</Label>
            <Select
              value={form.setTeamId ?? ""}
              onValueChange={(value) =>
                setForm((prev) => (prev ? { ...prev, setTeamId: value } : prev))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) && teams.length > 0 ? (
                  teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-teams" disabled>
                    {teamsQuery.isLoading ? "Chargement..." : "Aucune équipe"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* TEAM UNSET */}
          <div className="grid gap-3">
            <Label>Équipe responsable (retrait)</Label>
            <Select
              value={form.unsetTeamId ?? ""}
              onValueChange={(value) =>
                setForm((prev) =>
                  prev ? { ...prev, unsetTeamId: value } : prev
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(teams) && teams.length > 0 ? (
                  teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-teams" disabled>
                    {teamsQuery.isLoading ? "Chargement..." : "Aucune équipe"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* COUNT */}
          <div className="grid gap-3">
            <Label>Nombre d&apos;équipements</Label>
            <Input
              type="number"
              min={1}
              value={form.items}
              onChange={(e) => {
                const value = Number(e.target.value);
                const next = Number.isNaN(value) ? 1 : Math.max(1, value);
                setForm((prev) => (prev ? { ...prev, items: next } : prev));
              }}
            />
            <div className="text-xs text-muted-foreground">
              Ajustez au besoin le nombre d&apos;unités.
            </div>
          </div>

          {/* SET */}
          <div className="grid gap-3">
            <Label>Date de pose</Label>
            <DateAndTimePicker
              value={form.setAt}
              onChange={(date) =>
                date &&
                setForm((prev) => (prev ? { ...prev, setAt: date } : prev))
              }
              dateLabel="Date"
              timeLabel="Heure"
              placeholder="Choisir la date"
              showSeconds={false}
            />
          </div>

          {/* UNSET */}
          <div className="grid gap-3">
            <Label>Date de retrait</Label>
            <DateAndTimePicker
              value={form.unsetAt}
              onChange={(date) =>
                date &&
                setForm((prev) => (prev ? { ...prev, unsetAt: date } : prev))
              }
              dateLabel="Date"
              timeLabel="Heure"
              placeholder="Choisir la date"
              showSeconds={false}
            />
          </div>
        </div>

        <SheetFooter>
          <Button
            className='hover:cursor-pointer'
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate()}
          >
            Sauvegarder
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
