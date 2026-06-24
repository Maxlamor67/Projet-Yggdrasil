import { Button } from "@/components/ui/button";
import type { GetGeometryResponse } from "@/api";
import { Edit, Trash2, MapPinIcon } from "lucide-react";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(s));
}

function calculateDistanceKm(geometryPoints: GetGeometryResponse["geometryPoints"]): number | null {
  const pts = [...(geometryPoints ?? [])]
    .sort((x, y) => (x.rank ?? 0) - (y.rank ?? 0))
    .map((gp) => ({ lat: gp.point.latitude, lng: gp.point.longitude }));

  if (pts.length < 2) return null;

  let total = 0;
  for (let i = 1; i < pts.length; i++) total += haversineKm(pts[i - 1], pts[i]);
  return Math.round(total * 10) / 10;
}

type Props = {
  parcours: GetGeometryResponse;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ParcoursExpandedContent({
  parcours,
  onEdit,
  onDelete,
}: Props) {
  const distanceKm = calculateDistanceKm(parcours.geometryPoints);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground">DÉTAILS</p>

        <div className="space-y-1 text-sm">
          <p>
            🏃 <span className="font-medium">Vitesse rapide :</span>{" "}
            {parcours.route?.fasterParticipantSpeedEstimate ?? "—"} km/h
          </p>
          <p>
            🚶 <span className="font-medium">Vitesse lente :</span>{" "}
            {parcours.route?.slowerParticipantSpeedEstimate ?? "—"} km/h
          </p>
          <p>
            📏 <span className="font-medium">Distance :</span>{" "}
            {distanceKm === null ? "—" : `${distanceKm} km`}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => onEdit?.(parcours.id)}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </Button>

        <Button
          variant="destructive"
          onClick={() => onDelete?.(parcours.id)}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}
