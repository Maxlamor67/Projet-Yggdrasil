import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore } from "@/stores/mapStore";

export default function MapInstanceSaver(): null {
  const map = useMap();
  const setMapInstance = useMapStore((state) => state.setMapInstance);

  useEffect(() => {
    setMapInstance(map);

    return () => {
      setMapInstance(null);
    };
  }, [map, setMapInstance]);

  return null;
}
