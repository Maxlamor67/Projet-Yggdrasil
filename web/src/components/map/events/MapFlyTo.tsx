import { useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { useEffect } from "react";

interface MapFlyToProps {
  newPosition: LatLngTuple | null;
}

export default function MapFlyTo({ newPosition }: MapFlyToProps): null {
  const map = useMap();

  useEffect(() => {
    if (newPosition) {
      map.flyTo(newPosition, 17, { duration: 2 });
    } else {
      map.flyTo([48.583726, 7.759735], 12, { duration: 2 });
    }
  }, [newPosition]);

  return null;
}
