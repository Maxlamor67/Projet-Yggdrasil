import { Polygon } from "react-leaflet";
import type { GeometryWithId } from "@/types/geometry.ts";
import { useMemo } from "react";

// Palette de 10 couleurs vives pour les zones (différentes des parcours)
const AREA_COLORS = [
    "#3B82F6", // Bleu
    "#10B981", // Émeraude
    "#8B5CF6", // Violet
    "#F59E0B", // Jaune doré
    "#06B6D4", // Turquoise
    "#EC4899", // Rose
    "#84CC16", // Vert lime
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#F97316", // Orange vif
];

// Hash simple pour convertir un ID en index stable
function hashStringToIndex(str: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash) % max;
}

export function getAreaColorById(geometryId?: string): string {
    if (!geometryId) return AREA_COLORS[0];
    const index = hashStringToIndex(geometryId, AREA_COLORS.length);
    return AREA_COLORS[index];
}

interface AreaPolylineProps {
    area: GeometryWithId;
    selectedAreaId: string | null;
    handleSelectArea: (area: string) => void;
}

export default function AreaPolyline({ area, selectedAreaId, handleSelectArea }: AreaPolylineProps) {
    const baseColor = useMemo(() => getAreaColorById(area.geometryId), [area.geometryId]);

    const isSelected = selectedAreaId === area.geometryId;
    const color = isSelected ? "red" : baseColor;

    return (
        <Polygon
            key={area.geometryId}
            positions={area.points}
            pathOptions={{
                color,
                weight: isSelected ? 4 : 2,
                bubblingMouseEvents: false
            }}
            eventHandlers={{
                click: () => handleSelectArea(area.geometryId)
            }}
        />
    );
}
