import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { type LatLngBoundsExpression } from "leaflet";
import { useMapStore } from "@/stores/mapStore.ts";
import { captureMapElement } from "@/lib/mapCapture.ts";

interface MapScreenshotButtonProps {
    getBounds: () => LatLngBoundsExpression | null
}

export default function MapScreenshotEvent({ getBounds } : MapScreenshotButtonProps): null {
    const map = useMap();
    const screenshotTrigger = useMapStore((state) => state.screenshotTrigger);
    const setScreenshotTrigger = useMapStore((state) => state.setScreenshotTrigger);
    const setMapScreenshot = useMapStore((state) => state.setMapScreenshot);

  useEffect(() => {
    if (screenshotTrigger > 0) {
      const bounds = getBounds();

      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] });

        // Capture la carte après l'ajustement des limites
        setTimeout(async () => {
          const screenshot = await captureMapElement(bounds, map);
          setMapScreenshot(screenshot);
          setScreenshotTrigger(0);
        }, 500);
      } else {
        setScreenshotTrigger(0);
      }
    }
  }, [screenshotTrigger, map, getBounds, setScreenshotTrigger, setMapScreenshot]);

  return null;
}
