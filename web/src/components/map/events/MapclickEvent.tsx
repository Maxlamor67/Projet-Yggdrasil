import { useMapEvents } from "react-leaflet";
import type { LatLngTuple } from "leaflet";

interface MapClickEventProps {
  handleMapClick: (e: LatLngTuple) => void;
}

export default function MapClickEvent({
  handleMapClick,
}: MapClickEventProps): null {
  useMapEvents({
    click: (e) => {
      handleMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}
