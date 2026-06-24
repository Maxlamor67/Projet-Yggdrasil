import {
  MapContainer,
  Marker,
  Rectangle,
  Polygon,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { useState } from "react";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import type {
  Course,
  Area,
  Geometry,
  GeometryWithId,
  PolylineEquipment,
} from "@/types/geometry";
import MapClickEvent from "./events/MapclickEvent.tsx";
import MapFlyTo from "./events/MapFlyTo.tsx";
import MapAutoBounds from "./events/MapAutoBounds.tsx";
import MapZoomOnGeometry from "./events/MapZoomOnGeometry.tsx";
import { renderToString } from "react-dom/server";
import L from "leaflet";
import DrawingBar from "@/components/map/drawing-bar/DrawingBar.tsx";
import vehicleIcon from "@/assets/images/vehicle_icon.png";
import selectedVehicleIcon from "@/assets/images/selected_vehicle_icon.png";

import SecurityPointMarker from "@/components/map/SecurityPointMarker.tsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import MapScreenshotEvent from "@/components/map/events/MapScreenshotEvent.tsx";
import CoursePolyline, {
  getCrossIcon,
} from "@/components/map/CoursePolyline.tsx";
import EquipmentPolyline from "@/components/map/EquipmentPolyline.tsx";

import { api } from "@/lib/api.ts";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";
import type {
  GetAllPointsToSecureResponse as PointToSecure,
  CreateGeometryDto, GetAttentionPointsResponse, GetAllSafetyEquipmentsResponse,
} from "@/api";
import AttentionPointMarker from "@/components/attention-point/AttentionPointMarker.tsx";
import AreaPolyline from "@/components/map/AreaPolyline.tsx";

interface MapProps {
  searchPosition: LatLngTuple | null;
  securityPointPosition: LatLngTuple | null;
  drawingMode: string | null;
  setDrawingMode: (mode: string | null) => void;
  newCourse: Course;
  setNewCourse: (course: Course) => void;
  courses: GeometryWithId[];
  areas: GeometryWithId[];
  SecurityPoints: PointToSecure[];
  newArea: Area;
  setNewArea: (area: Area) => void;
  newPolyline: PolylineEquipment;
  setNewPolyline: (newPolyline: PolylineEquipment) => void;
  undoStack: Geometry[];
  setUndoStack: (undoStack: Geometry[]) => void;
  redoStack: Geometry[];
  setRedoStack: (redoStack: Geometry[]) => void;
  handleCancel: () => void;
  handleValidate: () => void;
  handleFinish: () => void;
  deleteGeometry: () => void;
  selectedPoint: PointToSecure | null;
  setSelectedPoint: (point: PointToSecure | null) => void;
  newPointPosition: LatLngTuple | null;
  setNewPointPosition: (point: LatLngTuple) => void;
  editedPoint: PointToSecure | null;
  setEditedPoint: (point: PointToSecure | null) => void;
  projectId: string;
  polylines: GetAllSafetyEquipmentsResponse[];
  vehicles: GetAllSafetyEquipmentsResponse[];
  equipmentIdToPolyline: { [key: string]: PolylineEquipment };
  equipmentIdToVehiclePosition: { [key: string]: LatLngTuple };
  attentionPoints: GetAttentionPointsResponse[];
  newAttentionPointPosition: LatLngTuple | null;
  setNewAttentionPointPosition: (attentionPoint: LatLngTuple | null) => void;
  onSelectSecurityPoint?: (p: PointToSecure | null) => void;
  newVehicle: LatLngTuple | null;
  setNewVehicle: (point: LatLngTuple) => void;
  selectedCourseId: string | null;
  onSelectCourse: (id: string) => void;
  selectedAreaId: string | null;
  onSelectArea: (id: string) => void;
  safetyEquipmentTypesName: string[],
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  isTimelinePlaying: boolean
}

interface CreateGeometryPayload {
  type: "AREA" | "ROUTE";
  geometry: Geometry;
}

export default function Map({
  searchPosition,
  securityPointPosition,
  drawingMode,
  setDrawingMode,
  newCourse,
  setNewCourse,
  newArea,
  setNewArea,
  newPolyline,
  setNewPolyline,
  SecurityPoints: securityPoints,
  selectedPoint,
  setSelectedPoint,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  handleCancel,
  handleValidate,
  handleFinish,
  deleteGeometry,
  newPointPosition,
  setNewPointPosition,
  editedPoint,
  setEditedPoint,
  projectId,
  courses,
  areas,
  polylines,
  vehicles,
  equipmentIdToPolyline,
  equipmentIdToVehiclePosition,
  onSelectSecurityPoint,
  attentionPoints,
  newAttentionPointPosition,
  setNewAttentionPointPosition,
  newVehicle,
  setNewVehicle,
  selectedCourseId,
  onSelectCourse,
  selectedAreaId,
  onSelectArea,
  safetyEquipmentTypesName,
  selectedEquipmentId,
  onSelectEquipment,
  isTimelinePlaying
}: MapProps) {
  const queryClient = useQueryClient();
  const { showError } = useError();
  const [warning, setWarning] = useState<string | null>(null);

  const showWarning = (message: string) => {
    setWarning(message);
    setTimeout(() => setWarning(null), 2000);
  };

  /** GET 1 POINT (edit) */
  const { data: editedPointData } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["editedPoint", editedPoint?.id],
      queryFn: () =>
        api.pointToSecure.pointToSecureControllerFindOneV2(
          projectId,
          editedPoint!.id
        ),
      enabled: editedPoint !== null,
      retry: 0,
    }),
    "GetEditedPoint",
    "Impossible de charger le point"
  );

  /** MUTATION → CREATE GEOMETRY (V2) */
  const createGeometryMutation = useMutation({
    mutationFn: async ({ type, geometry }: CreateGeometryPayload) => {
      const pointsDto = geometry.map(([lat, lng], index) => ({
        latitude: lat,
        longitude: lng,
        rank: index,
      }));

      const nowLabel = new Date().toISOString().slice(0, 16).replace("T", " ");

      const payload: CreateGeometryDto = {
        type,
        name: type === "ROUTE" ? `Parcours ${nowLabel}` : `Zone ${nowLabel}`,
        points: pointsDto,
        ...(type === "ROUTE"
          ? {
              route: {
                startAt: new Date().toISOString(),
                slowerParticipantSpeedEstimate: 4,
                fasterParticipantSpeedEstimate: 8,
              },
            }
          : {}),
      };

      return api.geometry.geometryControllerCreateV2(projectId, payload);
    },
    onSuccess: () => {
      toast.success("Géométrie créée avec succès");
    },
    onError: (error) => {
      logError(error, "CreateGeometry");
      const errorInfo = processAxiosError(
        error,
        "Erreur lors de l'enregistrement"
      );
      showError(errorInfo);
    },
  });

  /** Bounds */
  const maxDisplayBounds: LatLngBoundsExpression = [
    [48.6890802, 7.548794611111111],
    [48.4584682, 7.846059027777778],
  ];

  const maxDrawBounds: LatLngBoundsExpression = [
    [48.6890802, 7.548794611111111],
    [48.4584682, 7.846059027777778],
  ];

  const isPositionInDrawBounds = ([lat, lng]: LatLngTuple): boolean => {
    const [[maxLat, minLng], [minLat, maxLng]] = maxDrawBounds;
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  };

  // Icône verte pour les nouveaux points à sécuriser (pendant la création)
  const getNewPointIcon = () => {
    return L.divIcon({
      html: renderToString(
        <div className="relative flex items-center justify-center animate-pulse">
          <span className="absolute h-8 w-8 rounded-full bg-green-500 opacity-75 animate-ping" />
          <span className="relative h-6 w-6 rounded-full bg-green-600 shadow-lg border-2 border-white flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <span className="absolute -bottom-1 h-2 w-2 rotate-45 bg-green-600" />
        </div>
      ),
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 24],
    });
  };

  // Icône verte pour les nouveaux points d'attention (pendant la création)
  const getNewAttentionPointIcon = () => {
    return L.divIcon({
      html: renderToString(
        <div className="relative flex items-center justify-center">
          <span className="absolute h-4 w-4 rounded-full bg-green-400 opacity-30 animate-ping" />
          <div className="relative bg-green-500 rounded-full p-1 shadow-lg border border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
        </div>
      ),
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  /** Désélectionne tous les éléments de la carte */
  const clearSelection = () => {
    onSelectCourse("");
    onSelectArea("");
    onSelectEquipment("");
    onSelectSecurityPoint?.(null);
  };

  /** CLICK MAP */
  const handleMapClick = (pos: LatLngTuple) => {
    if (!drawingMode) return;

    if (!isPositionInDrawBounds(pos)) {
      showWarning("Hors zone");
      return;
    }

    // Désélectionner tous les éléments lorsque l'utilisateur commence à dessiner
    clearSelection();

    if (drawingMode === "course") addPointToGeometry(newCourse, setNewCourse, pos);
    if (drawingMode === "area") addPointToGeometry(newArea, setNewArea, pos);
    if (drawingMode === "createPoint") addPointToSecure(pos);
    if (drawingMode === "polylineEquipment") addPointToGeometry(newPolyline, setNewPolyline, pos);
    if (drawingMode === "vehicleEquipment") addVehicleEquipment(pos);
    if (drawingMode === "attentionPoint") addAttentionPoint(pos);
  };

  function addPointToGeometry(geom: Geometry, setGeom: any, pos: LatLngTuple) {
    setUndoStack([...undoStack, geom]);
    setRedoStack([]);
    setGeom([...geom, pos]);
  }

  function addPointToSecure(pos: LatLngTuple) {
    setSelectedPoint(null);
    setNewPointPosition(pos);
  }

  function addAttentionPoint(pos: LatLngTuple) {
    setSelectedPoint(null);
    setNewAttentionPointPosition(pos);
  }

    function addVehicleEquipment(pos: LatLngTuple) {
      setSelectedPoint(null);
      setNewVehicle(pos);
    }

  /** Undo/Redo */
  const handleUndo = () => {
    if (drawingMode === "course") undoAction(newCourse, setNewCourse);
    if (drawingMode === "area") undoAction(newArea, setNewArea);
    if (drawingMode === "polylineEquipment")
      undoAction(newPolyline, setNewPolyline);
  };

  function undoAction(geom: Geometry, setGeom: (geometry: Geometry) => void) {
    setRedoStack([...redoStack, geom]);
    const prev = undoStack.pop();
    if (prev) setGeom(prev);
  }

  const handleRedo = () => {
    if (drawingMode === "course") redoAction(newCourse, setNewCourse);
    if (drawingMode === "area") redoAction(newArea, setNewArea);
    if (drawingMode === "polylineEquipment")
      redoAction(newPolyline, setNewPolyline);
  };

  function redoAction(geom: Geometry, setGeom: (geometry: Geometry) => void) {
    setUndoStack([...undoStack, geom]);
    const next = redoStack.pop();
    if (next) setGeom(next);
  }

  /** Reset edited point position */
  const handleResetEditedPointPosition = () => {
    const data = editedPointData?.data;
    if (!data || !editedPoint) return;

    setEditedPoint({
      ...editedPoint,
      point: {
        ...editedPoint.point,
        latitude: data.point.latitude,
        longitude: data.point.longitude,
      },
    });
  };

  /** Screenshot bounds */
  const getScreenshotBounds = (): LatLngBoundsExpression | null => {
    const allCoursePoints = courses.flatMap((g) => g.points);
    const allAreaPoints = areas.flatMap((g) => g.points);
    const allPts = securityPoints.map(
      (p) => [p.point.latitude, p.point.longitude] as LatLngTuple
    );

    const pts = [...allCoursePoints, ...allAreaPoints, ...allPts];
    if (pts.length === 0) return null;

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

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  };

  /** Zoom sur une géométrie */
  const selectedGeometryPoints: LatLngTuple[] | null =
      isTimelinePlaying ? null : selectedCourseId
    ? courses.find(c => c.geometryId === selectedCourseId)?.points || null
    : selectedAreaId
    ? areas.find(a => a.geometryId === selectedAreaId)?.points || null
    : selectedEquipmentId !== null && equipmentIdToPolyline[selectedEquipmentId]
    ? equipmentIdToPolyline[selectedEquipmentId]
    : selectedEquipmentId !== null && equipmentIdToVehiclePosition[selectedEquipmentId]
    ? [equipmentIdToVehiclePosition[selectedEquipmentId]]
    : null;

  const handleSelectCourse = (geometryId: string) => {
    if (selectedCourseId === geometryId) {
      onSelectCourse("");
    } else {
      onSelectCourse(geometryId);
      onSelectArea("");
      onSelectEquipment("");
      onSelectSecurityPoint?.(null);
    }
  };

  const handleSelectArea = (geometryId: string) => {
    if (selectedAreaId === geometryId) {
      onSelectArea("");
    } else {
      onSelectArea(geometryId);
      onSelectCourse("");
      onSelectEquipment("");
      onSelectSecurityPoint?.(null);
    }
  };

  const handleSelectEquipment = (equipmentId: string) => {
    if (selectedEquipmentId === equipmentId) {
      onSelectEquipment("");
    } else {
      onSelectEquipment(equipmentId);
      onSelectCourse("");
      onSelectArea("");
      onSelectSecurityPoint?.(null);
    }
  };

  /** Select point */
  const handleSelectPoint = (p: PointToSecure) => {
    if (editedPoint || newPointPosition) return;

    if (selectedPoint?.id === p.id) {
      onSelectSecurityPoint?.(null);
    } else {
      onSelectSecurityPoint?.(p);
      // Désélectionner les autres catégories
      onSelectCourse("");
      onSelectArea("");
      onSelectEquipment("");
    }
  };

  const getVehicleIcon = (isSelected: boolean) => {
    return L.icon({
      iconUrl: isSelected ? selectedVehicleIcon : vehicleIcon,
      iconSize: [36, 32],
      iconAnchor: [16, 16],
    });
  };

  /** Validate (create geometry) */
  const handleValidateInternal = async () => {
    if (!drawingMode) {
      handleValidate();
      return;
    }

    try {
      if (drawingMode === "course" && newCourse.length > 0) {
        await createGeometryMutation.mutateAsync({
          type: "ROUTE",
          geometry: newCourse,
        });
      }

      if (drawingMode === "area" && newArea.length > 0) {
        await createGeometryMutation.mutateAsync({
          type: "AREA",
          geometry: newArea,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["geometries", projectId],
      });
      handleValidate();
    } catch {
      showWarning("Erreur lors de l’enregistrement.");
    }
  };

  return (
    <MapContainer
      maxBounds={maxDisplayBounds}
      className="h-full w-full rounded-xl"
      center={[48.583726, 7.759735]}
      zoom={14}
      minZoom={12}
      maxZoom={21}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url={`${import.meta.env.VITE_HTTP_API_URL}/v2/maps/tiles/{z}/{x}/{y}`}
        maxZoom={21}
        maxNativeZoom={19}
      />

      <MapScreenshotEvent getBounds={getScreenshotBounds} />
      <MapAutoBounds courses={courses} areas={areas} />
      <MapZoomOnGeometry points={selectedGeometryPoints} />
      {searchPosition ? (
        <MapFlyTo newPosition={searchPosition} />
      ) : (
        <MapFlyTo newPosition={securityPointPosition} />
      )}
      <MapClickEvent handleMapClick={handleMapClick} />

      {searchPosition && <Marker position={searchPosition} />}

      {drawingMode && (
        <DrawingBar
          warning={warning}
          drawingMode={drawingMode}
          redoStack={redoStack}
          undoStack={undoStack}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleCancel={handleCancel}
          handleValidate={handleValidateInternal}
          handleFinish={handleFinish}
          deleteGeometry={deleteGeometry}
          handleResetEditedPointPosition={handleResetEditedPointPosition}
        />
      )}

      {drawingMode && (
        <Rectangle
          bounds={maxDrawBounds}
          pathOptions={{ color: "gray", weight: 2 }}
        />
      )}

      {/* Zones - Rendu en premier (en arrière-plan) */}
      {areas.map((area) => (
          <AreaPolyline key={area.geometryId} area={area} selectedAreaId={selectedAreaId} handleSelectArea={handleSelectArea}/>
      ))}
      {newArea.length > 0 && (
        <Polygon positions={newArea} pathOptions={{ color: "#16A34A", weight: 4 }} />
      )}

      {/* Parcours et Équipements au même niveau (au-dessus des zones) */}
      {/* Parcours */}
      {courses.map((course) => (
        <CoursePolyline
          key={course.geometryId}
          coursePoints={course.points}
          geometryId={course.geometryId}
          isSelected={selectedCourseId === course.geometryId}
          onSelect={() => handleSelectCourse(course.geometryId)}
        />
      ))}
      {newCourse.length > 0 && <CoursePolyline coursePoints={newCourse} isCreating={true} />}

      {/* Equipments polylines (API source) */}
      {polylines.map((polyline) => (
        <EquipmentPolyline
          key={polyline.id}
          equipmentTypeName={polyline.safetyEquipmentTypeLength?.safetyEquipmentType.name}
          positions={polyline.safetyEquipmentPoints?.map((point) => [point.point.latitude, point.point.longitude])}
          barLength={3}
          isSelected={selectedEquipmentId === polyline.id}
          onSelect={() => handleSelectEquipment(polyline.id)}
          safetyEquipmentTypesName={safetyEquipmentTypesName}
        />
      ))}

    {/* Preview current drawing */}
    {newPolyline.length > 0 &&
    (newPolyline.length > 1 ? (
      <EquipmentPolyline positions={newPolyline} barLength={3} isCreating={true} />
    ) : (
      <Marker position={newPolyline[0]} icon={getCrossIcon("#16A34A")} />
    ))}

      {/* Equipments point (API source) */}
      {vehicles.map((vehicle) => {
        console.log(vehicle);
        const isSelected = selectedEquipmentId === vehicle.id;
        return (
            <Marker
                key={vehicle.id}
                position={[vehicle.safetyEquipmentPoints[0]?.point.latitude, vehicle.safetyEquipmentPoints[0]?.point.longitude]}
                icon={getVehicleIcon(isSelected)}
                eventHandlers={{
                  click: () => handleSelectEquipment(vehicle.id)
                }}
            />
        );
      })}
      {newVehicle && <Marker position={newVehicle} icon={getVehicleIcon(false)} />}

      {/* Points à sécuriser */}
      {securityPoints.map((p) => (
        <SecurityPointMarker
          key={p.id}
          point={p}
          selectedPoint={selectedPoint}
          handleSelectPoint={handleSelectPoint}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
          editedPoint={editedPoint}
          setEditedPoint={setEditedPoint}
        />
      ))}

      {newPointPosition && (
        <Marker position={newPointPosition} icon={getNewPointIcon()} />
      )}

    {attentionPoints.map((attentionPoint) => (
    <AttentionPointMarker key={attentionPoint.id} attentionPoint={attentionPoint} projectId={projectId}/>
    ))}
    {newAttentionPointPosition && (
    <Marker
      position={newAttentionPointPosition}
      icon={getNewAttentionPointIcon()}
    />
    )}
    </MapContainer>
  );
}
