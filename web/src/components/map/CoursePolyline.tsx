import {Marker, Polyline} from "react-leaflet";
import type {Course} from "@/types/geometry.ts";
import L from "leaflet";
import {renderToString} from "react-dom/server";
import {X} from "lucide-react";
import { useRef, useEffect, useMemo } from "react";

interface CourseProps {
    coursePoints: Course;
    isSelected?: boolean;
    onSelect?: () => void;
    geometryId?: string;
    isCreating?: boolean;
}

// Palette de 10 couleurs vives (sans rouge, réservé à la sélection)
const COURSE_COLORS = [
    "#f39e05", // Jaune doré
    "#16A34A", // Vert
    "#9333EA", // Violet
    "#EA580C", // Orange
    "#0891B2", // Cyan
    "#c209dc", // Magenta
    "#65A30D", // Lime
    "#0284C7", // Bleu ciel
    "#ed3aba", // Rose
    "#000000", // Noir
];

// Hash simple pour convertir un ID en index stable
function hashStringToIndex(str: string, max: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash; // Convertit en entier 32 bits
    }
    return Math.abs(hash) % max;
}

export function getCourseColorById(geometryId?: string): string {
    if (!geometryId) return COURSE_COLORS[0];
    const index = hashStringToIndex(geometryId, COURSE_COLORS.length);
    return COURSE_COLORS[index];
}

// Couleur utilisée pendant la phase de création
const CREATION_COLOR = "#16A34A"; // Vert

export function getCrossIcon(color: string) {
    return L.divIcon({
        html: renderToString(<X size={24} color={color} />),
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
}

export default function CoursePolyline({ coursePoints, isSelected = false, onSelect, geometryId, isCreating = false } : CourseProps) {
    const polylineRef = useRef<any>(null);

    const baseColor = useMemo(() => getCourseColorById(geometryId), [geometryId]);

    // Vert pendant la création, rouge si sélectionné, sinon couleur de base
    const color = isCreating ? CREATION_COLOR : (isSelected ? "red" : baseColor);

    useEffect(() => {
        if (polylineRef.current && onSelect) {
            const layer = polylineRef.current;
            layer.on('click', onSelect);

            return () => {
                layer.off('click', onSelect);
            };
        }
    }, [onSelect]);

    return (
        <>
            <Marker position={coursePoints[0]} icon={getCrossIcon("blue")} />
            <Marker position={coursePoints[coursePoints.length - 1]} icon={getCrossIcon("red")} />
            <Polyline
                ref={polylineRef}
                positions={coursePoints}
                pathOptions={{
                    color,
                    weight: isSelected ? 6 : 4,
                    bubblingMouseEvents: false
                }}
            />
        </>
    )
}
