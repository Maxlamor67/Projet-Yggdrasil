import { Button } from "@/components/ui/button";
import type { GetGeometryResponse } from "@/api";
import { Edit, Trash2, MapPinIcon } from "lucide-react";

function calculateAreaKm2(geometryPoints: GetGeometryResponse["geometryPoints"]): number | null {
  const pts = [...(geometryPoints ?? [])]
    .sort((x, y) => (x.rank ?? 0) - (y.rank ?? 0))
    .map((gp) => ({ lat: gp.point.latitude, lng: gp.point.longitude }));

  if (pts.length < 3) return null;

  // Formule de l'aire d'un polygone (approximation simple)
  // Pour une précision réelle, il faudrait utiliser une projection appropriée
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].lng * pts[j].lat;
    area -= pts[j].lng * pts[i].lat;
  }
  area = Math.abs(area) / 2;

  // Conversion approximative en km² (valeur très approximative)
  // 1 degré ≈ 111 km à l'équateur
  const km2 = area * 111 * 111;
  return Math.round(km2 * 100) / 100;
}

type Props = {
  zone: GetGeometryResponse;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ZonesExpandedContent({
  zone,
  onEdit,
  onDelete,
}: Props) {
  const areaKm2 = calculateAreaKm2(zone.geometryPoints);
  const pointCount = zone.geometryPoints?.length ?? 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground">DÉTAILS</p>

        <div className="space-y-1 text-sm">
          <p>
            📍 <span className="font-medium">Nombre de points :</span>{" "}
            {pointCount}
          </p>
          <p>
            📐 <span className="font-medium">Surface estimée :</span>{" "}
            {areaKm2 === null ? "—" : `${areaKm2} km²`}
          </p>
          <p>
            📅 <span className="font-medium">Créée le :</span>{" "}
            {zone.createdAt ? new Date(zone.createdAt).toLocaleDateString("fr-FR") : "—"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => onEdit?.(zone.id)}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </Button>

        <Button
          variant="destructive"
          onClick={() => onDelete?.(zone.id)}
          className="flex items-center gap-2 hover:cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </Button>
      </div>
    </div>
  );
}
