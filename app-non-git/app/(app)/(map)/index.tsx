import React, {useEffect, useRef, useState, useMemo, useCallback} from "react";
import {Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MapView, {Callout, Marker, Polygon, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {eq} from "drizzle-orm";
import {Feather} from '@expo/vector-icons';
import Button from "../../../components/ui/Button";

import Add from "./add";
import {PointsModal} from "../../../components/PointsModal";
import {PoiDetailsModal} from "../../../components/PoiDetailsModal";
import RouteModal from "../../../components/route-modal";
import {SecurityPointsModal} from "../../../components/SecurityPointsModal";
import {getRouteFromMapbox} from "../../../utils/routeService";
import {db} from "../../../db/client";
import {useProjectStore} from "../../../store/projectStore";
import {
  geometries, geometryPoints, points, pointsToSecure, pointToSecurePhotos,
  projects, safetyEquipmentTypeLengths, safetyEquipmentTypes, schedulePointPointers,
  schedulePoints, schedules, teams,
  type Point, type PointToSecure, type SafetyEquipmentType, type Schedule,
  type SchedulePoint, type SchedulePointPointer, type SafetyEquipmentTypeLength
} from "../../../db/schema";

// ============= CONSTANTES =============
const INITIAL_REGION = {
  latitude: 48.5734,
  longitude: 7.7521,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const ARRIVAL_THRESHOLD_METERS = 25;
const MIN_STROKE_WIDTH = 2;
const MAX_STROKE_WIDTH = 8;
const DEFAULT_STROKE_WIDTH = 4;

const COLORS = {
  primary: "#00C853",
  danger: "#e53935",
  route: "#d83c51",
  connector: "#1E00C8",
  schedule: "#FF6B00",
  geometry: "#2196F3",
} as const;

// ============= TYPES =============
export type PoiWithRelations = PointToSecure & {
  point: Point | null;
  safetyEquipmentType: SafetyEquipmentType | null;
};

type ScheduleWithRelations = Schedule & {
  pointer: SchedulePointPointer & {
    points: (SchedulePoint & { point: Point })[];
  };
  safetyEquipmentTypeLength: SafetyEquipmentTypeLength & {
    safetyEquipmentType: SafetyEquipmentType;
  };
};

type Coordinate = { latitude: number; longitude: number };

// ============= FONCTIONS UTILITAIRES =============
const clampStrokeWidth = (w?: number | null): number => {
  if (!w || typeof w !== 'number' || Number.isNaN(w)) return DEFAULT_STROKE_WIDTH;
  return Math.max(MIN_STROKE_WIDTH, Math.min(Math.round(w), MAX_STROKE_WIDTH));
};

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const findClosestIndexToPoint = (pt: Coordinate, path: Coordinate[]): number => {
  if (!pt || !path?.length) return -1;

  let bestIdx = -1;
  let bestDistance = Infinity;

  path.forEach((point, idx) => {
    const distance = haversineDistance(pt.latitude, pt.longitude, point.latitude, point.longitude);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIdx = idx;
    }
  });

  return bestIdx;
};

// ============= COMPOSANT PRINCIPAL =============
export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {project, setProject} = useProjectStore();
  const mapRef = useRef<MapView>(null);
  const hasCenteredRef = useRef(false);
  const lastArrivedRef = useRef<number | null>(null);

  // États d'interface
  const [poiModalVisible, setPoiModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [securityPointsModalVisible, setSecurityPointsModalVisible] = useState(false);
  const [arrivalModalVisible, setArrivalModalVisible] = useState(false);
  const [selectedPoiId, setSelectedPoiId] = useState<number | null>(null);
  const [highlightedPoiId, setHighlightedPoiId] = useState<number | null>(null);
  const [calloutPoiId, setCalloutPoiId] = useState<number | null>(null);
  const [arrivalPoi, setArrivalPoi] = useState<PoiWithRelations | null>(null);

  // États de carte et localisation
  const [region, setRegion] = useState<any | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [isFollowing, setIsFollowing] = useState(true);

  // États de navigation
  const [currentRoute, setCurrentRoute] = useState<Coordinate[]>([]);
  const [currentRouteRes, setCurrentRouteRes] = useState<any | null>(null);
  const [routeTargets, setRouteTargets] = useState<Coordinate[]>([]);
  const [routeTarget, setRouteTarget] = useState<Coordinate | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // États de données
  const [pois, setPois] = useState<PoiWithRelations[]>([]);
  const [routePolylines, setRoutePolylines] = useState<{ id: number; coords: Coordinate[] }[]>([]);
  const [areaPolygons, setAreaPolygons] = useState<{ id: number; coords: Coordinate[] }[]>([]);
  const [schedulePolylines, setSchedulePolylines] = useState<{ id: string; coords: Coordinate[]; color: string }[]>([]);
  const [scheduleMarkers, setScheduleMarkers] = useState<{ id: string; latitude: number; longitude: number; label: string }[]>([]);

  // ============= QUERIES =============
  const getImportedProjectQuery = useQuery({
    queryKey: ['getFirstProject', 'getInterestPoints', 'getZones', 'getTraces'],
    queryFn: async () => {
      try {
        const points = await db.query.pointsToSecure.findMany({
          where: eq(pointsToSecure.projectId, project!.id),
          with: { point: true, safetyEquipmentType: true },
        });
        setPois(points);

        const allGeometries = await db.query.geometries.findMany({
          where: eq(geometries.projectId, project!.id),
          with: {
            points: {
              with: { point: true },
            },
          },
        });

        const routes: { id: number; coords: Coordinate[] }[] = [];
        const areas: { id: number; coords: Coordinate[] }[] = [];

        allGeometries.forEach((geometry) => {
          const coords = geometry.points
              .filter(gp => gp.point?.latitude != null && gp.point?.longitude != null)
              .sort((a, b) => a.rank - b.rank)
              .map(gp => ({ latitude: gp.point!.latitude, longitude: gp.point!.longitude }));

          if (coords.length === 0) return;

          if (geometry.type === 'ROUTE' && coords.length >= 2) {
            routes.push({ id: geometry.id, coords });
          } else if (geometry.type === 'AREA' && coords.length >= 3) {
            areas.push({ id: geometry.id, coords });
          }
        });

        setRoutePolylines(routes);
        setAreaPolygons(areas);

        return points;
      } catch (_) {
        Alert.alert('Erreur', "Impossible de charger le projet.");
        return null;
      }
    },
    enabled: project?.type === 'SOFTWARE_TO_APP',
  });

  const getAllSchedulesQuery = useQuery({
    queryKey: ['getFirstProject', 'getAllSchedules'],
    queryFn: async () => {
      try {
        const schedulesData = await db.query.schedules.findMany({
          where: eq(schedules.projectId, project!.id),
          with: {
            pointer: {
              with: {
                points: { with: { point: true } },
              },
            },
            safetyEquipmentTypeLength: {
              with: { safetyEquipmentType: true },
            },
          },
        });

        const polylines: typeof schedulePolylines = [];
        const markers: typeof scheduleMarkers = [];

        schedulesData.forEach((schedule) => {
          const equipmentType = schedule.safetyEquipmentTypeLength?.safetyEquipmentType?.model;
          const points = schedule.pointer?.points || [];

          const coords = points
              .filter(p => p.point?.latitude != null && p.point?.longitude != null)
              .map(p => ({ latitude: p.point!.latitude, longitude: p.point!.longitude }));

          if (coords.length === 0) return;

          if (equipmentType === 'OBSTACLE' && coords.length >= 2) {
            polylines.push({ id: `schedule-${schedule.id}`, coords, color: COLORS.schedule });
          } else if (equipmentType === 'VEHICLE' && coords.length > 0) {
            markers.push({
              id: `schedule-${schedule.id}`,
              latitude: coords[0].latitude,
              longitude: coords[0].longitude,
              label: schedule.safetyEquipmentTypeLength?.safetyEquipmentType?.name || '',
            });
          }
        });

        setSchedulePolylines(polylines);
        setScheduleMarkers(markers);

        return schedulesData;
      } catch (_) {
        Alert.alert('Erreur', "Impossible de charger le planning.");
        return null;
      }
    },
    enabled: project?.type === 'SOFTWARE_TO_APP_PLANNING',
  });

  // ============= HANDLERS =============
  const refreshPois = useCallback(async () => {
    try {
      const data = await db.query.pointsToSecure.findMany({
        where: eq(pointsToSecure.projectId, project?.id!),
        with: { point: true, safetyEquipmentType: true },
      });
      setPois(data);
    } catch (e) {
      console.warn('refreshPois error', e);
    }
  }, [project?.id]);

  const handleNavigateToSchedule = useCallback((schedule: ScheduleWithRelations) => {
    const points = schedule.pointer?.points || [];
    if (points.length === 0) return;

    const coords = points
        .filter(p => p.point?.latitude != null && p.point?.longitude != null)
        .map(p => ({ latitude: p.point!.latitude, longitude: p.point!.longitude }));

    if (coords.length === 0) return;

    const centerLat = coords.reduce((sum, c) => sum + c.latitude, 0) / coords.length;
    const centerLon = coords.reduce((sum, c) => sum + c.longitude, 0) / coords.length;

    const targetRegion = {
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setRegion(targetRegion);
    setIsFollowing(false);
    mapRef.current?.animateToRegion(targetRegion, 1000);
  }, []);

  const openGoogleMapsDirections = useCallback((schedule: ScheduleWithRelations) => {
    if (!userLocation) {
      Alert.alert("Erreur", "Impossible de récupérer votre position");
      return;
    }

    const points = schedule.pointer?.points || [];
    const coords = points
        .filter(p => p.point?.latitude != null && p.point?.longitude != null)
        .map(p => ({ latitude: p.point!.latitude, longitude: p.point!.longitude }));

    if (coords.length === 0) {
      Alert.alert("Erreur", "Le planning n'a pas de coordonnées valides");
      return;
    }

    const destinationLat = coords[0].latitude;
    const destinationLon = coords[0].longitude;
    const scheduleName = schedule.safetyEquipmentTypeLength?.safetyEquipmentType?.name || "Destination";

    Alert.alert(
        "Ouvrir Google Maps",
        `Voulez-vous afficher l'itinéraire vers ${scheduleName.toLowerCase()} ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destinationLat},${destinationLon}&travelmode=driving`;
              Linking.openURL(url).catch(() => {
                Alert.alert("Erreur", "Impossible d'ouvrir Google Maps");
              });
            },
          },
        ]
    );
  }, [userLocation]);

  const handleDeleteDatabase = useCallback(() => {
    Alert.alert(
        "Supprimer la base de données",
        "Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                await db.delete(schedulePoints);
                await db.delete(schedulePointPointers);
                await db.delete(schedules);
                await db.delete(pointToSecurePhotos);
                await db.delete(pointsToSecure);
                await db.delete(geometryPoints);
                await db.delete(geometries);
                await db.delete(safetyEquipmentTypeLengths);
                await db.delete(safetyEquipmentTypes);
                await db.delete(teams);
                await db.delete(points);
                await db.delete(projects);

                setProject(null);
                await queryClient.invalidateQueries({ queryKey: ['getFirstProject'] });
                router.replace('/(app)');
              } catch (error) {
                Alert.alert("Erreur", "Impossible de supprimer la base de données");
              }
            },
          },
        ]
    );
  }, [queryClient, router]);

  const cancelRoute = useCallback(() => {
    setCurrentRoute([]);
    setIsNavigating(false);
    lastArrivedRef.current = null;
    setArrivalModalVisible(false);
  }, []);

  const generateRouteFromIds = useCallback(async (ids: (string | number)[]) => {
    if (!ids?.length) return;

    const selectedPois = ids.map((id) => pois.find((p) => p.id === id)).filter(Boolean) as PoiWithRelations[];
    if (!selectedPois.length) return;

    const coords: Coordinate[] = [];
    if (userLocation) coords.push(userLocation);
    selectedPois.forEach((p) => {
      if (p?.point?.latitude != null && p?.point?.longitude != null) {
        coords.push({ latitude: p.point.latitude, longitude: p.point.longitude });
      }
    });

    if (coords.length < 2) {
      console.warn("Besoin d'au moins 2 points pour créer un itinéraire.");
      return;
    }

    try {
      const res = await getRouteFromMapbox(coords, 'driving');
      
      
      setTimeout(() => {
        setCurrentRoute(res.path);
        setCurrentRouteRes(res);

        const targets = coords.slice(1);
        setRouteTargets(targets);
        setRouteTarget(targets[0] || null);
        setIsNavigating(true);

        if (res.path?.length && mapRef.current) {
          mapRef.current.animateToRegion({
            ...res.path[0],
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }, 500);
        }
      }, 100);
    } catch (err) {
      console.warn('Erreur route Mapbox:', err);
      setTimeout(() => {
        setCurrentRoute(coords);
        setIsNavigating(true);
      }, 100);
    }
  }, [pois, userLocation]);

  // ============= COMPUTED VALUES =============
  const connectorCoords = useMemo(() => {
    if (!routeTarget || !currentRoute.length || !userLocation) return null;

    const startIdx = findClosestIndexToPoint(userLocation, currentRoute);
    const endIdx = findClosestIndexToPoint(routeTarget, currentRoute);

    if (startIdx < 0 || endIdx < 0) {
      return [userLocation, routeTarget];
    }

    const slice = startIdx <= endIdx
        ? currentRoute.slice(startIdx, endIdx + 1)
        : currentRoute.slice(endIdx, startIdx + 1).reverse();

    const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        slice[0].latitude,
        slice[0].longitude
    );

    return distance > 10 ? [userLocation, ...slice] : slice;
  }, [routeTarget, currentRoute, userLocation]);

  const isAnyModalVisible = poiModalVisible || addModalVisible || securityPointsModalVisible;
  const isPlanning = project?.type === 'SOFTWARE_TO_APP_PLANNING';
  const isProject = project?.type === 'SOFTWARE_TO_APP';

  // ============= EFFECTS =============
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission de localisation refusée");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const newRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setUserLocation({ latitude: newRegion.latitude, longitude: newRegion.longitude });

        if (isFollowing) {
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1000);
        }

        subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Highest, distanceInterval: 10 },
            (l) => {
              const updatedRegion = {
                latitude: l.coords.latitude,
                longitude: l.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };

              setUserLocation({ latitude: updatedRegion.latitude, longitude: updatedRegion.longitude });

              if (isFollowing) {
                setRegion(updatedRegion);
                mapRef.current?.animateToRegion(updatedRegion, 500);
              }
            }
        );
      } catch (e) {
        console.warn("Erreur en récupérant la localisation:", e);
      }
    })();

    return () => {
      subscription?.remove();
    };
  }, [isFollowing]);

  useEffect(() => {
    if (!userLocation || !routeTargets.length) return;

    const target = routeTargets[0];
    const distance = haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        target.latitude,
        target.longitude
    );

    if (distance <= ARRIVAL_THRESHOLD_METERS) {
      setRouteTargets((prev) => {
        const [, ...rest] = prev;
        setRouteTarget(rest[0] || null);
        return rest;
      });
    }
  }, [userLocation, routeTargets]);

  useEffect(() => {
    if (!userLocation || !pois.length || !isNavigating || !currentRoute.length) return;

    for (const poi of pois) {
      if (poi.point?.latitude == null || poi.point?.longitude == null) continue;

      const distance = haversineDistance(
          userLocation.latitude,
          userLocation.longitude,
          poi.point.latitude,
          poi.point.longitude
      );

      if (distance <= ARRIVAL_THRESHOLD_METERS && lastArrivedRef.current !== poi.id) {
        lastArrivedRef.current = poi.id ?? null;
        setArrivalPoi(poi);
        setArrivalModalVisible(true);
        break;
      }
    }
  }, [userLocation, pois, currentRoute, isNavigating]);

  useEffect(() => {
    if (!currentRoute.length) {
      lastArrivedRef.current = null;
      setIsNavigating(false);
    }
  }, [currentRoute]);

  useEffect(() => {
    if (!hasCenteredRef.current && region && mapRef.current) {
      try {
        mapRef.current.animateToRegion(region, 800);
        hasCenteredRef.current = true;
      } catch (e) {
        console.warn('Error animating to initial region', e);
      }
    }
  }, [region]);

  // ============= RENDER =============
  if (getImportedProjectQuery.isLoading) {
    return <View style={styles.container} />;
  }

  return (
      <View style={styles.container}>
        {!isAnyModalVisible && (
            <Button
              title="X"
              variant="danger"
              onPress={handleDeleteDatabase}
              style={styles.deleteDbButton}
            />
        )}

        <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            mapType={Platform.OS === 'ios' ? 'hybrid' : 'satellite'}
            region={region ?? undefined}
            initialRegion={region ?? INITIAL_REGION}
            showsUserLocation
            onRegionChangeComplete={(r) => !isFollowing && setRegion(r)}
            showsCompass={true}
            toolbarEnabled={false}
            showsMyLocationButton={false}
        >
          {/* POIs */}
          {pois.map((poi) => (
              <Marker
                  key={poi.id}
                  coordinate={{ latitude: poi.point!.latitude, longitude: poi.point!.longitude }}
                  draggable
                  pinColor={highlightedPoiId === poi.id ? COLORS.primary : undefined}
                  onDragEnd={async (e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    await db.update(points).set({ latitude, longitude }).where(eq(points.id, poi.pointId));
                    setPois((prev) => prev.map((x) => (x.id === poi.id ? { ...x, point: { ...x.point!, latitude, longitude } } : x)));
                  }}
                  onPress={() => {
                    if (Platform.OS !== 'ios') {
                      poi.id && setSelectedPoiId(poi.id);
                    }
                  }}
              >
                {Platform.OS === 'ios' && (
                  <Callout onPress={() => { poi.id && setSelectedPoiId(poi.id); }} tooltip={false}>
                    <View style={{ 
                      paddingHorizontal: 16, 
                      paddingVertical: 10, 
                      backgroundColor: "white", 
                      borderRadius: 8, 
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 100
                    }}>
                      <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>Voir détails</Text>
                    </View>
                  </Callout>
                )}
              </Marker>
          ))}

          {/* Route principale */}
          {currentRoute.length > 0 && (
              <>
                <Polyline coordinates={currentRoute} strokeColor={COLORS.route} strokeWidth={DEFAULT_STROKE_WIDTH} />
                {connectorCoords && (
                    <Polyline
                        coordinates={connectorCoords}
                        strokeColor={COLORS.connector}
                        strokeWidth={clampStrokeWidth(currentRouteRes?.strokeWidth)}
                    />
                )}
              </>
          )}

          {/* Schedules */}
          {schedulePolylines.map((line) => (
              <Polyline
                  key={line.id}
                  coordinates={line.coords}
                  strokeColor={line.color}
                  strokeWidth={DEFAULT_STROKE_WIDTH}
                  lineDashPattern={[10, 5]}
              />
          ))}

          {scheduleMarkers.map((marker) => (
              <Marker
                  key={marker.id}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  pinColor={COLORS.schedule}
              >
                {Platform.OS === 'ios' && (
                  <Callout tooltip={false}>
                    <View style={{ padding: 8 }}>
                      <Text style={{ color: '#666', fontWeight: 'bold' }}>{marker.label}</Text>
                      <Text style={{ color: '#999', fontSize: 12 }}>Véhicule planifié</Text>
                    </View>
                  </Callout>
                )}
              </Marker>
          ))}

          {/* Géométries */}
          {routePolylines.map((route) => (
              <Polyline
                  key={`route-${route.id}`}
                  coordinates={route.coords}
                  strokeColor={COLORS.geometry}
                  strokeWidth={DEFAULT_STROKE_WIDTH}
              />
          ))}

          {areaPolygons.map((area) => (
              <Polygon
                  key={`area-${area.id}`}
                  coordinates={area.coords}
                  fillColor="rgba(33, 150, 243, 0.2)"
                  strokeColor={COLORS.geometry}
                  strokeWidth={2}
              />
          ))}
        </MapView>

        {/* Boutons d'action */}
        {!isAnyModalVisible && (
            <>
              {!isPlanning && (
                <>
                  <TouchableOpacity
                      style={styles.recenterButton}
                      onPress={() => {
                        if (userLocation && mapRef.current) {
                          const r = { ...userLocation, latitudeDelta: 0.01, longitudeDelta: 0.01 };
                          setIsFollowing(true);
                          setRegion(r);
                          mapRef.current.animateToRegion(r, 500);
                        }
                      }}
                  >
                    <Text style={{ color: 'white', fontSize: 24 }}>🧭</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pointsButton} onPress={() => setPoiModalVisible(true)}>
                    <Text style={styles.pointsButtonIcon}>📍</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.pcConnectButton}
                      onPress={() => router.push('/(app)/scan-qr')}
                  >
                    <Text style={styles.pcConnectButtonIcon}>🖥️</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </>
              )}

              {isPlanning && (
                <TouchableOpacity
                    style={styles.planningCenterButton}
                    onPress={() => setSecurityPointsModalVisible(true)}
                >
                  <Text style={styles.planningCenterButtonIcon}>📅</Text>
                </TouchableOpacity>
              )}

              {/* {!isPlanning && (
                <TouchableOpacity
                    style={styles.securityButton}
                    onPress={() => setSecurityPointsModalVisible(true)}
                >
                  <Text style={styles.securityButtonIcon}>📅</Text>
                </TouchableOpacity>
              )} */}
            </>
        )}

        {currentRoute.length > 0 && !isAnyModalVisible && (
            <Button
              title="Annuler l'itinéraire"
              variant="danger"
              onPress={cancelRoute}
              style={styles.cancelButton}
            />
        )}

        {/* Modals */}
        <PointsModal
            visible={poiModalVisible}
            onClose={() => setPoiModalVisible(false)}
            onGenerateRoute={generateRouteFromIds}
            onRefresh={refreshPois}
            onNavigateToPoi={(poi) => {
              if (poi.point && mapRef.current) {
                const targetRegion = {
                  latitude: poi.point.latitude,
                  longitude: poi.point.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                };
                setIsFollowing(false);
                setRegion(targetRegion);
                mapRef.current.animateToRegion(targetRegion, 1000);
              }
            }}
            pois={pois}
        />

        <SecurityPointsModal
            visible={securityPointsModalVisible}
            onClose={() => setSecurityPointsModalVisible(false)}
            schedulesPlanning={getAllSchedulesQuery.data || []}
            onRefresh={() => getAllSchedulesQuery.refetch()}
            onNavigateToSchedule={handleNavigateToSchedule}
            onOpenDirections={openGoogleMapsDirections}
        />

        <Add
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            mapRegion={region}
            userLocation={userLocation}
            onCreated={async (poi) => {
              setPois((prev) => [...prev, poi]);

              if (mapRef.current && poi.point) {
                const newRegion = {
                  latitude: poi.point.latitude,
                  longitude: poi.point.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                setRegion(newRegion);
                mapRef.current.animateToRegion(newRegion, 500);
              }

              await refreshPois();
            }}
        />

        {selectedPoiId && (
            <PoiDetailsModal
                visible
                onClose={() => setSelectedPoiId(null)}
                poiId={selectedPoiId}
            />
        )}

        <RouteModal
            visible={routeModalVisible}
            onClose={() => setRouteModalVisible(false)}
            mapRegion={region}
            onGenerate={async (coords: Coordinate[]) => {
              try {
                const res = await getRouteFromMapbox(coords, 'driving');
                setCurrentRoute(res.path);
                setCurrentRouteRes(res);

                const targets = coords.slice(1);
                setRouteTargets(targets);
                setRouteTarget(targets[0] || null);
                setIsNavigating(true);

                if (res.path?.length && mapRef.current) {
                  mapRef.current.animateToRegion({
                    ...res.path[0],
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }, 500);
                }
              } catch (err) {
                console.warn('Erreur route Mapbox:', err);
                setCurrentRoute(coords);
                setRouteTargets(coords.slice(1));
                setRouteTarget(coords[1] || null);
                setCurrentRouteRes(null);
              }
            }}
        />

        {arrivalModalVisible && arrivalPoi && (
            <View style={styles.arrivalOverlay}>
              <View style={styles.arrivalCard}>
                <Text style={styles.arrivalTitle}>Vous êtes arrivé au point</Text>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <Button
                    title="Voir détails"
                    variant="primary"
                    onPress={() => {
                      setSelectedPoiId(arrivalPoi.id ?? null);
                      setArrivalModalVisible(false);
                    }}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    title="Fermer"
                    variant="secondary"
                    onPress={() => setArrivalModalVisible(false)}
                  />
                </View>
              </View>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  addButton: {
    position: "absolute",
    bottom: 60,
    left: "50%",
    width: 65,
    height: 65,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
    transform: [{ translateX: -32.5 }],
  },
  addButtonText: {
    fontSize: 50,
    color: "white",
    fontWeight: "800",
    marginTop: -4,
    marginRight: -1,
  },
  recenterButton: {
    position: 'absolute',
    right: 20,
    bottom: 130,
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  pointsButton: {
    position: "absolute",
    bottom: 200,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  pointsButtonIcon: {
    fontSize: 32,
    color: COLORS.primary,
    marginTop: -2,
  },
  pcConnectButton: {
    position: "absolute",
    bottom: 270,
    right : 20,
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  pcConnectButtonIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  securityButton: {
    position: "absolute",
    bottom: 130,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  securityButtonIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  arrivalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 200,
  },
  arrivalCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
  },
  arrivalTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cancelButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 70,
    elevation: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  deleteDbButton: {
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    elevation: 5,
    zIndex: 100,
  },
  deleteDbButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  planningCenterButton: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    width: 65,
    height: 65,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
    transform: [{ translateX: -32.5 }],
  },
  planningCenterButtonIcon: {
    fontSize: 32,
    color: "white",
  },
});
