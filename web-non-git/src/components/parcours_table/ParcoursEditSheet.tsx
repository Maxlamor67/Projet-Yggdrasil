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
import { DateAndTimePicker } from "../DateAndTimePicker";

import { api } from "@/lib/api";
import type {
  CreateRankedPointDto,
  UpdateGeometryDto,
  GetGeometryResponse,
} from "@/api";
import { GeometryType } from "@/api";

type Props = {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parcours: GetGeometryResponse | null;
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

export function ParcoursEditSheet({
  projectId,
  open,
  onOpenChange,
  parcours,
  onSave,
}: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [faster, setFaster] = useState<number>(1);
  const [slower, setSlower] = useState<number>(1);
  const [saving, setSaving] = useState(false);

  const existingPoints = useMemo(
    () => (parcours ? toRankedPoints(parcours.geometryPoints) : []),
    [parcours],
  );

  useEffect(() => {
    if (!parcours) return;

    setName(parcours.name ?? "");

    const s = parcours.route?.startAt ? new Date(parcours.route.startAt) : null;
    setStartAt(s);

    setFaster(parcours.route?.fasterParticipantSpeedEstimate ?? 1);
    setSlower(parcours.route?.slowerParticipantSpeedEstimate ?? 1);
  }, [parcours]);

  if (!parcours) return null;

  const isRoute = parcours.type === GeometryType.Route;

  async function submit() {
    // IMPORTANT: snapshot non-null pour TS + éviter les soucis de fermeture
    const current = parcours;
    if (!current) return;

    if (saving) return;

    try {
      setSaving(true);

      const payload: UpdateGeometryDto = {
        name,
        points: existingPoints,
        route:
          isRoute && startAt
            ? {
                startAt: startAt.toISOString(),
                fasterParticipantSpeedEstimate: faster,
                slowerParticipantSpeedEstimate: slower,
              }
            : undefined,
      };

      await api.geometry.geometryControllerUpdateV2(projectId, current.id, payload);

      // Invalider la query des géométries pour mettre à jour la carte
      await queryClient.invalidateQueries({ queryKey: ["geometries", projectId] });

      // Build updated object with required fields preserved from current
      const updated = {
        ...current,
        name: payload.name ?? current.name,
        route:
          isRoute && payload.route
            ? {
                ...(current.route as NonNullable<GetGeometryResponse["route"]>),
                startAt: payload.route.startAt,
                fasterParticipantSpeedEstimate: payload.route.fasterParticipantSpeedEstimate,
                slowerParticipantSpeedEstimate: payload.route.slowerParticipantSpeedEstimate,
              }
            : current.route,
      } satisfies GetGeometryResponse;

      onSave(updated);
      onOpenChange(false);
    } catch (e) {
      console.error("Erreur update parcours:", e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Modifier le parcours</SheetTitle>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {isRoute && (
            <>
              <div className="grid gap-3">
                <Label>Date et heure de début</Label>
                <DateAndTimePicker
                  value={startAt ?? undefined}
                  onChange={(date) => setStartAt(date ?? null)}
                  dateLabel="Date"
                  timeLabel="Heure"
                  placeholder="Choisir la date"
                  showSeconds={false}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>Vitesse rapide (km/h)</Label>
                  <Input
                    type="number"
                    value={faster}
                    min={1}
                    step={0.1}
                    onChange={(e) => setFaster(Number(e.target.value))}
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Vitesse lente (km/h)</Label>
                  <Input
                    type="number"
                    value={slower}
                    min={1}
                    step={0.1}
                    onChange={(e) => setSlower(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button className='hover:cursor-pointer' onClick={submit} disabled={saving || (isRoute && !startAt)}>
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
