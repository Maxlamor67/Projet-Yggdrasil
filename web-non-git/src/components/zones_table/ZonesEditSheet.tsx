import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { api } from "@/lib/api";
import type {
  CreateRankedPointDto,
  UpdateGeometryDto,
  GetGeometryResponse,
} from "@/api";

type Props = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: GetGeometryResponse | null;
  onSave: (updated: GetGeometryResponse) => void;
};

function toRankedPoints(
  points: GetGeometryResponse["geometryPoints"],
): CreateRankedPointDto[] {
  const sorted = [...(points ?? [])].sort(
    (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
  );

  return sorted.map((gp) => ({
    latitude: gp.point.latitude,
    longitude: gp.point.longitude,
    rank: gp.rank ?? 0,
  }));
}

export function ZonesEditSheet({
  projectId,
  open,
  onOpenChange,
  zone,
  onSave,
}: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const existingPoints = useMemo(
    () => (zone ? toRankedPoints(zone.geometryPoints) : []),
    [zone],
  );

  useEffect(() => {
    if (!zone) return;
    setName(zone.name ?? "");
  }, [zone]);

  if (!zone) return null;

  async function submit() {
    // IMPORTANT: snapshot non-null pour TS + éviter les soucis de fermeture
    const current = zone;
    if (!current) return;

    if (saving) return;

    try {
      setSaving(true);

      const payload: UpdateGeometryDto = {
        name,
        points: existingPoints,
      };

      await api.geometry.geometryControllerUpdateV2(projectId, current.id, payload);

      // Invalider la query des géométries pour mettre à jour la carte
      await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });

      // Build updated object with required fields preserved from current
      const updated = {
        ...current,
        name: payload.name ?? current.name,
      } satisfies GetGeometryResponse;

      onSave(updated);
      onOpenChange(false);
    } catch (e) {
      console.error("Erreur update zone:", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier la zone</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <SheetFooter>
          <Button className='hover:cursor-pointer' onClick={submit} disabled={saving}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
