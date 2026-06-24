import { useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import { useEffect } from "react";

interface MapZoomOnGeometryProps {
  points: LatLngTuple[] | null;
}

export default function MapZoomOnGeometry({ points }: MapZoomOnGeometryProps): null {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    let minLat = points[0][0];
    let maxLat = points[0][0];
    let minLng = points[0][1];
    let maxLng = points[0][1];

    points.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const bounds: LatLngBoundsExpression = [
      [minLat, minLng],
      [maxLat, maxLng],
    ];

    map.fitBounds(bounds, { padding: [50, 50], duration: 1 });
  }, [points, map]);

  return null;
}
