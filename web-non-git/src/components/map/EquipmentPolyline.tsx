import { Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type { PolylineEquipment } from "@/types/geometry.ts";
import { useRef, useEffect, useMemo } from "react";

// Palette de couleurs distinctes
const COLOR_PALETTE = [
    "#6c5a4b", "#374151", "#a19f9f", "#676e79", "#9d6b6b", "#1767d0",
    "#7a6060", "#705447", "#66705c", "#5b6a70", "#8B5CF6", "#EC4899"
];

const DEFAULT_COLOR = "#1767d0";
const CREATION_COLOR = "#16A34A"; // Vert pendant la création

interface EquipmentPolylineProps {
    positions: PolylineEquipment;
    equipmentTypeName?: string;
    safetyEquipmentTypesName?: string[];
    barLength?: number;
    isSelected?: boolean;
    onSelect?: () => void;
    isCreating?: boolean;
}

export default function EquipmentPolyline({
                                              positions,
                                              equipmentTypeName,
                                              safetyEquipmentTypesName,
                                              barLength = 3,
                                              isSelected = false,
                                              onSelect,
                                              isCreating = false,
                                          }: EquipmentPolylineProps) {
    const mainPolylineRef = useRef<any>(null);
    const startBarRef = useRef<any>(null);
    const endBarRef = useRef<any>(null);

    // Génère un mapping dynamique des couleurs basé sur la liste des types
    const typeColors = useMemo(() => {
        const colors: Record<string, string> = {};
        safetyEquipmentTypesName?.forEach((name, index) => {
            colors[name] = COLOR_PALETTE[index % COLOR_PALETTE.length];
        });
        return colors;
    }, [safetyEquipmentTypesName]);

    const typeColor = typeColors[equipmentTypeName ?? ''] || DEFAULT_COLOR;

    if (!positions || positions.length < 2) return null;

    const start = positions[0];
    const end = positions[positions.length - 1];
    // Vert pendant la création, rouge si sélectionné, sinon couleur du type
    const color = isCreating ? CREATION_COLOR : (isSelected ? "red" : typeColor);
    const weight = isSelected ? 5 : 3;

    useEffect(() => {
        const refs = [mainPolylineRef, startBarRef, endBarRef];
        refs.forEach(ref => {
            if (ref.current && onSelect) {
                const layer = ref.current;
                layer.on('click', onSelect);
                return () => {
                    layer.off('click', onSelect);
                };
            }
        });
    }, [onSelect]);

    const metersPerDegree = 111320;
    const barLengthInDegrees = barLength / metersPerDegree;

    const calculatePerpendicularBar = (point: LatLngTuple, nextPoint: LatLngTuple): [LatLngTuple, LatLngTuple] => {
        const dx = nextPoint[1] - point[1];
        const dy = nextPoint[0] - point[0];
        const length = Math.sqrt(dx * dx + dy * dy);
        const normDx = dx / length;
        const normDy = dy / length;
        const perpDx = -normDy;
        const perpDy = normDx;

        return [
            [point[0] - perpDy * barLengthInDegrees, point[1] - perpDx * barLengthInDegrees],
            [point[0] + perpDy * barLengthInDegrees, point[1] + perpDx * barLengthInDegrees],
        ];
    };

    const startBar = calculatePerpendicularBar(start, positions[1]);
    const endBar = calculatePerpendicularBar(end, positions[positions.length - 2]);



    return (
        <>
            <Polyline ref={mainPolylineRef} positions={positions} pathOptions={{ color, weight, bubblingMouseEvents: false }} />
            <Polyline ref={startBarRef} positions={startBar} pathOptions={{ color, weight, bubblingMouseEvents: false }} />
            <Polyline ref={endBarRef} positions={endBar} pathOptions={{ color, weight, bubblingMouseEvents: false }} />
        </>
    );
}
