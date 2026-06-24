import type { LatLngBoundsExpression } from "leaflet";
import type L from "leaflet";
import { toPng } from "html-to-image";

export async function captureMapElement(
  bounds?: LatLngBoundsExpression | null,
  mapInstance?: L.Map | null
): Promise<string | null> {
  try {
    if (!mapInstance) {
      return null;
    }

    if (bounds) {
      mapInstance.fitBounds(bounds, {
        padding: [80, 80],
        animate: false,
        maxZoom: 15,
      });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const mapContainer = mapInstance.getContainer();

    // Masquer temporairement les contrôles
    const controlsToHide = mapContainer.querySelectorAll(
      '.leaflet-control-zoom, .leaflet-control-attribution, .leaflet-control'
    );

    controlsToHide.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    // Capturer avec une meilleure qualité (2x la résolution native)
    const dataUrl = await toPng(mapContainer, {
      quality: 1.0,
      pixelRatio: 2,
      cacheBust: true,
      skipAutoScale: false,
    });

    // Restaurer les contrôles
    controlsToHide.forEach((el) => {
      (el as HTMLElement).style.display = '';
    });

    return dataUrl;
  } catch (error) {
    console.error('Error capturing map:', error);
    return null;
  }
}
