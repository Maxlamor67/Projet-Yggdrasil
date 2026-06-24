import { useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef } from "react";
import type { GeometryWithId } from "@/types/geometry";

interface MapAutoBoundsProps {
  courses: GeometryWithId[];
  areas: GeometryWithId[];
}

export default function MapAutoBounds({ courses, areas }: MapAutoBoundsProps): null {
  const map = useMap();
  const hasZoomedRef = useRef(false);

  useEffect(() => {
    // Récupère tous les points des constructions
    const allCoursePoints = courses.flatMap((g) => g.points);
    const allAreaPoints = areas.flatMap((g) => g.points);
    const pts = [...allCoursePoints, ...allAreaPoints];

    // Si des points existent ET qu'on n'a pas encore zoomé, zoom sur leur zone
    if (pts.length > 0 && !hasZoomedRef.current) {
      let minLat = pts[0][0];
      let maxLat = pts[0][0];
      let minLng = pts[0][1];
      let maxLng = pts[0][1];

      pts.forEach(([lat, lng]) => {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
      });

      const bounds: LatLngBoundsExpression = [
        [minLat, minLng],
        [maxLat, maxLng],
      ];

      // Ajoute un padding pour que le contenu ne soit pas collé au bord
      map.fitBounds(bounds, { padding: [50, 50], duration: 1 });
      hasZoomedRef.current = true;
    }
  }, [courses, areas, map]);

  return null;
}

