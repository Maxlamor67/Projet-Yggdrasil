type Coord = { latitude: number; longitude: number };

export async function getRouteFromMapbox(coords: Coord[], profile: 'driving' | 'walking' | 'cycling' = 'driving') {
  if (!coords || coords.length < 2) {
    throw new Error('At least two coordinates required to build a route');
  }

  const orsKey = process.env.EXPO_PUBLIC_ORS_API_KEY;
  const coordPairs = coords.map((c) => `${c.longitude},${c.latitude}`).join(';');

  if (orsKey) {
    try {
      const profileMap: Record<string, string> = {
        driving: 'driving-car',
        walking: 'foot-walking',
        cycling: 'cycling-regular',
      };
      const orsProfile = profileMap[profile] || 'driving-car';
      const url = `https://api.openrouteservice.org/v2/directions/${orsProfile}/geojson`;
      const body = { coordinates: coords.map((c) => [c.longitude, c.latitude]) };
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': orsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`ORS Directions API error: ${res.status} ${res.statusText} ${text}`);
      }
      const data = await res.json();
      if (!data || !data.features || !data.features[0]) {
        throw new Error('No route returned by OpenRouteService');
      }
      const routeFeature = data.features[0];
      const geometry = routeFeature.geometry; 
      const path: Coord[] = geometry.coordinates.map((p: [number, number]) => ({ latitude: p[1], longitude: p[0] }));
      const summary = routeFeature.properties && routeFeature.properties.summary ? routeFeature.properties.summary : {};
      const distance: number = summary.distance || 0;
      const duration: number = summary.duration || 0;
      return { path, distance, duration, raw: routeFeature, strokeWidth: 8 };
    } catch (e) {
      console.warn('OpenRouteService routing failed, falling back to Mapbox/OSRM:', e);
    }
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordPairs}?overview=full&geometries=geojson`;
    const res2 = await fetch(osrmUrl);
    if (!res2.ok) {
      const text = await res2.text().catch(() => '');
      throw new Error(`OSRM API error: ${res2.status} ${res2.statusText} ${text}`);
    }
    const data2 = await res2.json();
    if (!data2.routes || data2.routes.length === 0) {
      throw new Error('No route returned by OSRM');
    }
    const route2 = data2.routes[0];
    const geometry2 = route2.geometry;
    const path: Coord[] = geometry2.coordinates.map((p: [number, number]) => ({ latitude: p[1], longitude: p[0] }));
    const distance: number = route2.distance;
    const duration: number = route2.duration;
    return { path, distance, duration, raw: route2, strokeWidth: 525 };
  } catch (e) {
    throw new Error(`Routing failed (Mapbox + OSRM): ${e}`);
  }
}

export default getRouteFromMapbox;
