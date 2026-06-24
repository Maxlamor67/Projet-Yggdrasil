import { createFileRoute, useNavigate } from "@tanstack/react-router";
import SearchBar from "@/components/SearchBar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Map from "@/components/map/Map";
import { useCallback, useState, useEffect, useMemo } from "react";
import type { LatLngTuple } from "leaflet";
import { FileDown } from "lucide-react";
import { useMapStore } from "@/stores/mapStore.ts";
import type {
  GetAllPointsToSecureResponse as InterestPoint,
  GetAttentionPointsResponse as AttentionPoint,
  GetGeometryResponse,
  GetAllSafetyEquipmentsResponse,
  GetSafetyEquipmentTypeResponse,
  UpdatePointToSecureDto,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api.ts";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

import ModeSelector from "@/components/ModeSelector.tsx";
import EquipmentSelector from "@/components/EquipmentSelector.tsx";
import EquipmentCreationForm from "@/components/equipment/EquipmentCreationForm.tsx";
import AttentionPointCreationForm from "@/components/attention-point/AttentionPointCreationForm.tsx";
import { MapDataTables } from "@/components/map/MapDataTables";
import PointCreationForm from "@/components/interest-points/PointCreationForm";
import RouteCreationForm from "@/components/route/RouteCreationForm.tsx";
import { Timeline } from "@/components/TimelineSlider/Timeline";

export const Route = createFileRoute("/_auth/editor/$projectId/map")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const queryClient = useQueryClient();
  const { showError } = useError();

  const [activeTab, setActiveTab] = useState<
    "equipments" | "parcours" | "zones" | "points"
  >("equipments");

  const navigate = useNavigate();

  const [searchPosition, setSearchPosition] = useState<LatLngTuple | null>(
    null
  );
  const [securityPointPosition, setSecurityPointPosition] =
    useState<LatLngTuple | null>(null);

  // affichage équipements type obstacles
  const [equipments, setEquipments] = useState<GetAllSafetyEquipmentsResponse[]>([]);
  const polylines = equipments.filter((equipment) => equipment.safetyEquipmentTypeLength.safetyEquipmentType.model == 'OBSTACLE');
  const vehicles = equipments.filter((equipment) => equipment.safetyEquipmentTypeLength.safetyEquipmentType.model == 'VEHICLE');

  const [newCourse, setNewCourse] = useState<LatLngTuple[]>([]);
  const [newArea, setNewArea] = useState<LatLngTuple[]>([]);
  const [newPointPosition, setNewPointPosition] = useState<LatLngTuple | null>(
    null
  );
  const [newPolyline, setNewPolyline] = useState<LatLngTuple[]>([]);
  const [newVehicle, setNewVehicle] = useState<LatLngTuple | null>(null);
  const [newAttentionPointPosition, setNewAttentionPointPosition] =
    useState<LatLngTuple | null>(null);

  const [selectedPoint, setSelectedPoint] = useState<InterestPoint | null>(
    null
  );
  const [editedPoint, setEditedPoint] = useState<InterestPoint | null>(null);

  // IMPORTANT: on stock reminding ce que veut le POST -> safetyEquipmentTypeLengthId
  const [
    selectedSafetyEquipmentTypeLengthId,
    setSelectedSafetyEquipmentTypeLengthId,
  ] = useState<string | null>(null);
  const [
    selectedSafetyEquipmentTypeModel,
    setSelectedSafetyEquipmentTypeModel,
  ] = useState<string | null>(null);

  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState<string | null>(null);

  const [undoStack, setUndoStack] = useState<LatLngTuple[][]>([]);
  const [redoStack, setRedoStack] = useState<LatLngTuple[][]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "traite" | "non_traite"
  >("all");
  const triggerScreenshot = useMapStore((state) => state.triggerScreenshot);
  const mapScreenshot = useMapStore((state) => state.mapScreenshot);
  const screenshotTrigger = useMapStore((state) => state.screenshotTrigger);

  const [waitingForScreenshot, setWaitingForScreenshot] = useState(false);

  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  // Sélection des éléments de la carte
  const [selectedCourseIdState, setSelectedCourseIdState] = useState<
    string | null
  >(null);
  const [selectedAreaIdState, setSelectedAreaIdState] = useState<string | null>(
    null
  );
  const [selectedEquipmentIdState, setSelectedEquipmentIdState] = useState<
    string | null
  >(null);

  // Wrappers pour convertir "" à null et désélectionner les autres catégories
  const handleSelectCourse = (id: string) => {
    setSelectedCourseIdState(id === "" ? null : id);
    if (id !== "") {
      setSelectedAreaIdState(null);
      setSelectedEquipmentIdState(null);
      setSelectedPoint(null);
      setActiveTab("parcours");
    }
  };
  const handleSelectArea = (id: string) => {
    setSelectedAreaIdState(id === "" ? null : id);
    if (id !== "") {
      setSelectedCourseIdState(null);
      setSelectedEquipmentIdState(null);
      setSelectedPoint(null);
      setActiveTab("zones");
    }
  };
  const handleSelectEquipment = (id: string) => {
    setSelectedEquipmentIdState(id === "" ? null : id);
    if (id !== "") {
      setSelectedCourseIdState(null);
      setSelectedAreaIdState(null);
      setSelectedPoint(null);
      setActiveTab("equipments");
    }
  };

  /** ---------- SAFETY EQUIPMENT TYPES (API) ---------- */
  const { data: safetyTypesRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentTypes"],
      queryFn: () =>
        api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2(),
      retry: 0,
    }),
    "GetSafetyEquipmentTypes",
    "Impossible de charger les types d'\u00e9quipements"
  );
  const safetyEquipmentTypes: GetSafetyEquipmentTypeResponse[] =
    (safetyTypesRes?.data ?? []) as any[];

  const safetyEquipmentTypesName = safetyEquipmentTypes.map(
    (type) => type.name
  );

  /** ---------- POINTS A SECURISER ---------- */
  const { data: securityPointListData } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["pointsToSecure", projectId],
      queryFn: () =>
        api.pointToSecure.pointToSecureControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetPointsToSecure",
    "Impossible de charger les points \u00e0 sécuriser"
  );
  const rawInterestPoints: InterestPoint[] = securityPointListData?.data ?? [];
  const interestPoints: InterestPoint[] =
    statusFilter === "all"
      ? rawInterestPoints
      : statusFilter === "traite"
        ? rawInterestPoints.filter((p) => p.isTreated)
        : rawInterestPoints.filter((p) => !p.isTreated);

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      dto,
    }: {
      id: string;
      dto: UpdatePointToSecureDto;
    }) => api.pointToSecure.pointToSecureControllerUpdateV2(projectId, id, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pointsToSecure", projectId],
      });
      setEditedPoint(null);
    },
    onError: (error) => {
      logError(error, "UpdatePoint");
      showError(processAxiosError(error, "Impossible de modifier le point"));
    },
  });

  /** ---------- POINTS D'ATTENTION ---------- */
  const { data: attentionPointListData } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["attentionPoints", projectId],
      queryFn: () =>
        api.attentionPoint.attentionPointControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetAttentionPoints",
    "Impossible de charger les points d'attention"
  );
  const attentionPoints: AttentionPoint[] = attentionPointListData?.data ?? [];

  /** ---------- GEOMETRIES ---------- */
  const { data: geometriesResponse } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["geometries", projectId],
      queryFn: () => api.geometry.geometryControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetGeometries",
    "Impossible de charger les g\u00e9ométries"
  );

  const geometries: GetGeometryResponse[] = (geometriesResponse?.data ??
    []) as GetGeometryResponse[];

  const courses = geometries
    .filter((g) => g.type === "ROUTE")
    .map((g) => ({
      geometryId: g.id,
      points: (g.geometryPoints ?? [])
        .slice()
        .sort((a: any, b: any) => a.rank - b.rank)
        .map(
          (gp: any) => [gp.point.latitude, gp.point.longitude] as LatLngTuple
        ),
    }));

  const areas = geometries
    .filter((g) => g.type === "AREA")
    .map((g) => ({
      geometryId: g.id,
      points: (g.geometryPoints ?? [])
        .slice()
        .sort((a: any, b: any) => a.rank - b.rank)
        .map(
          (gp: any) => [gp.point.latitude, gp.point.longitude] as LatLngTuple
        ),
    }));

  /** ---------- SAFETY EQUIPMENTS (API) => polylines ---------- */
  const { data: safetyEquipmentsRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipments", projectId],
      queryFn: () =>
        api.safetyEquipment.safetyEquipmentControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetSafetyEquipments",
    "Impossible de charger les \u00e9quipements de sécurit\u00e9"
  );
  const safetyEquipments = useMemo(
    () => (safetyEquipmentsRes?.data ?? []) as GetAllSafetyEquipmentsResponse[],
    [safetyEquipmentsRes?.data]
  );

  const obstacleEquipments = useMemo(
    () =>
      safetyEquipments.filter(
        (safetyEquipment) =>
          safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType
            .model === "OBSTACLE"
      ),
    [safetyEquipments]
  );

  const vehicleEquipments = useMemo(
    () =>
      safetyEquipments.filter(
        (safetyEquipment) =>
          safetyEquipment.safetyEquipmentTypeLength.safetyEquipmentType
            .model === "VEHICLE"
      ),
    [safetyEquipments]
  );

  const vehicleEquipmentsPoints = useMemo(
    () =>
      vehicleEquipments.flatMap((vehicleEquipment) =>
        vehicleEquipment.safetyEquipmentPoints.map(
          (point) =>
            [point.point.latitude, point.point.longitude] as LatLngTuple
        )
      ),
    [vehicleEquipments]
  );

  const equipmentIdToPolyline: { [key: string]: LatLngTuple[] } = {};
  safetyEquipments.forEach((se: any) => {
    const coordinates = (se.safetyEquipmentPoints ?? [])
      .slice()
      .sort((a: any, b: any) => a.rank - b.rank)
      .map((p: any) => [p.point.latitude, p.point.longitude] as LatLngTuple);
    if (coordinates.length > 0) {
      equipmentIdToPolyline[se.id] = coordinates;
    }
  });

  // Map equipment ID to vehicle position (for VEHICLE equipments)
  const equipmentIdToVehiclePosition: { [key: string]: LatLngTuple } = {};
  vehicleEquipments.forEach((se: any) => {
    const point = se.safetyEquipmentPoints?.[0]?.point;
    if (point) {
      equipmentIdToVehiclePosition[se.id] = [point.latitude, point.longitude];
    }
  });

  const deleteGeometry = () => {
    // à recompléter si on permet de modifier les parcours ou les zones par la suite
  };

  const handleValidate = async () => {
    if (drawingMode == "editPoint") {
      if (!editedPoint) return;
      await updateMutation.mutateAsync({
        id: editedPoint.id,
        dto: {
          point: {
            latitude: editedPoint.point.latitude,
            longitude: editedPoint.point.longitude,
          },
        },
      });
    }

    setRedoStack([]);
    setUndoStack([]);
    setNewCourse([]);
    setNewArea([]);
    setNewPolyline([]);
    setNewVehicle(null);
    setDrawingMode(null);
  };

  const handleCancel = () => {
    setRedoStack([]);
    setUndoStack([]);
    setNewCourse([]);
    setNewArea([]);
    setNewPolyline([]);
    setNewVehicle(null);
    setEditedPoint(null);
    setDrawingMode(null);
  };

  const handleFinish = () => {
    setDrawingMode(null);
    setNewPointPosition(null);
  };

  const selectSecurityPoint = (p: InterestPoint | null) => {
    setSelectedPoint(p);
    if (p) {
      // Désélectionner les autres catégories
      setSelectedCourseIdState(null);
      setSelectedAreaIdState(null);
      setSelectedEquipmentIdState(null);
      setSelectedMode("point");
      setActiveTab("points");
    }
  };

  const handleButtonClick = () => {
    // Deselect all elements when entering drawing mode
    setSelectedCourseIdState(null);
    setSelectedAreaIdState(null);
    setSelectedEquipmentIdState(null);
    setSelectedPoint(null);
    setDrawingMode(null);
    setEditedPoint(null);

    if (selectedMode === "point") {
      setDrawingMode("createPoint");
    } else if (selectedMode === "course") {
      setDrawingMode("course");
    } else if (selectedMode === "area") {
      setDrawingMode("area");
    } else if (selectedMode === "equipment") {
      if (selectedSafetyEquipmentTypeModel == "OBSTACLE") {
        setDrawingMode("polylineEquipment");
      }
      if (selectedSafetyEquipmentTypeModel == "VEHICLE") {
        setDrawingMode("vehicleEquipment");
      }
    } else if (selectedMode === "attentionPoint") {
      setDrawingMode("attentionPoint");
    }
  };

  const handlePdfClick = () => {
    setWaitingForScreenshot(true);
    triggerScreenshot();
  };

  useEffect(() => {
    if (waitingForScreenshot && screenshotTrigger === 0 && mapScreenshot) {
      setWaitingForScreenshot(false);
      navigate({ to: `/editor/${projectId}/planning` });
    }
  }, [
    waitingForScreenshot,
    screenshotTrigger,
    mapScreenshot,
    navigate,
    projectId,
  ]);

  const syncUrl = `/editor/${projectId}/app-connect`;
  const teamUrl = `/editor/${projectId}/teams`;

  const { data: projectRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["project", projectId],
      queryFn: () => api.project.projectControllerFindOneV2(projectId),
    }),
    "GetProject",
    "Impossible de charger le projet"
  );

  const projectName = projectRes?.data?.name;
  const projectStartTime = projectRes?.data?.startAtDate;
  const projectEndTime = projectRes?.data?.endAtDate;

  function handleEquipmentChange(lengthId: string) {
    const type = safetyEquipmentTypes.find((t) =>
      t.lengths?.some((len) => len.id === lengthId)
    );
    setSelectedSafetyEquipmentTypeLengthId(lengthId);
    setSelectedSafetyEquipmentTypeModel(type?.model ?? null);
  }

  const handleActiveSafetyEquipmentsChange = useCallback(
    (activeSafetyEquipments: GetAllSafetyEquipmentsResponse[]) => {
      setEquipments(activeSafetyEquipments);
    },
    []
  );

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] w-full flex-row">
        {/* Left side */}
        <div className="flex h-full w-1/4 flex-col gap-2 overflow-y-auto p-4">
          {/* ------- MODALE ------- */}
          <h1 className="text-2xl font-bold truncate">
            Project : {projectName}
          </h1>

          <Separator className="m-1" />

          <SearchBar
            searchPosition={searchPosition}
            setSearchPosition={setSearchPosition}
          />

          <div className="flex justify-between items-center gap-2">
            <ModeSelector
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              disabled={drawingMode !== null || editedPoint != null}
            />

            <Button
              disabled={
                !selectedMode ||
                drawingMode !== null ||
                editedPoint != null ||
                (selectedMode === "equipment" &&
                  !selectedSafetyEquipmentTypeLengthId)
              }
              onClick={handleButtonClick}
              className="cursor-pointer w-1/4"
            >
              {drawingMode !== null
                ? "Dessin..."
                : selectedMode === "point" || selectedMode === "equipment"
                  ? "Ajouter"
                  : "Dessiner"}
            </Button>
          </div>

          {selectedMode === "equipment" && (
            <div>
              <EquipmentSelector
                safetyEquipmentTypes={safetyEquipmentTypes}
                selectedSafetyEquipmentTypeLengthId={
                  selectedSafetyEquipmentTypeLengthId
                }
                onEquipmentChange={handleEquipmentChange}
                disabled={drawingMode !== null || editedPoint != null}
              />
            </div>
          )}

          <Separator className="m-1" />

          <div className="flex-1 min-h-0 overflow-auto">
            {selectedMode === "point" && newPointPosition ? (
              <PointCreationForm
                latitude={newPointPosition[0]}
                longitude={newPointPosition[1]}
                setNewPointPosition={setNewPointPosition}
                setDrawingMode={setDrawingMode}
                projectId={projectId}
              />
            ) : selectedMode === "course" && drawingMode ? (
              <RouteCreationForm
                points={newCourse}
                projectId={projectId}
                onFinish={handleCancel}
              />
            ) : selectedMode === "equipment" && drawingMode ? (
              <EquipmentCreationForm
                newEquipment={
                  drawingMode == "polylineEquipment" ? newPolyline : newVehicle
                }
                projectId={projectId}
                onCancel={handleCancel}
                onSuccess={handleValidate}
                selectedSafetyEquipmentTypeLengthId={
                  selectedSafetyEquipmentTypeLengthId
                }
              />
            ) : selectedMode === "attentionPoint" &&
              drawingMode &&
              newAttentionPointPosition ? (
              <AttentionPointCreationForm
                setDrawingMode={setDrawingMode}
                projectId={projectId}
                setNewAttentionPointPosition={setNewAttentionPointPosition}
                pointDto={{
                  latitude: newAttentionPointPosition[0],
                  longitude: newAttentionPointPosition[1],
                }}
              />
            ) : (
              <MapDataTables
                projectId={projectId}
                selectedPoint={selectedPoint}
                setSelectedPoint={selectSecurityPoint}
                onViewPosition={(pos) => setSecurityPointPosition(pos)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedCourseId={selectedCourseIdState}
                onSelectCourse={handleSelectCourse}
                selectedAreaId={selectedAreaIdState}
                onSelectArea={handleSelectArea}
                selectedEquipmentId={selectedEquipmentIdState}
                onSelectEquipment={handleSelectEquipment}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            )}
          </div>

          <Separator className="bg-black mt-auto" />

          {/* Les boutons */}
          <div className="flex flex-col items-center justify-center gap-2 mt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-500 cursor-pointer w-full"
              onClick={handlePdfClick}
            >
              <FileDown /> Planning
            </Button>

            <Button
              className="w-full bg-green-600 hover:bg-green-500 hover:cursor-pointer"
              onClick={() => navigate({ to: teamUrl })}
            >
              Équipe
            </Button>

            <Button
              variant="outline"
              className="w-full hover:cursor-pointer"
              onClick={() => navigate({ to: syncUrl })}
            >
              Synchroniser avec le Mobile
            </Button>
          </div>
        </div>

        {/* Map side */}
        <Separator orientation="vertical" className="bg-black" />
        <div className="flex h-full w-3/4 p-1 flex-col">
          <div className="w-full h-6/7 ">
            <Map
              drawingMode={drawingMode}
              setDrawingMode={setDrawingMode}
              searchPosition={searchPosition}
              securityPointPosition={securityPointPosition}
              newCourse={newCourse}
              setNewCourse={setNewCourse}
              newArea={newArea}
              setNewArea={setNewArea}
              newPolyline={newPolyline}
              setNewPolyline={setNewPolyline}
              SecurityPoints={interestPoints}
              undoStack={undoStack}
              setUndoStack={setUndoStack}
              redoStack={redoStack}
              setRedoStack={setRedoStack}
              handleCancel={handleCancel}
              handleValidate={handleValidate}
              handleFinish={handleFinish}
              deleteGeometry={deleteGeometry}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              onSelectSecurityPoint={selectSecurityPoint}
              newPointPosition={newPointPosition}
              setNewPointPosition={setNewPointPosition}
              editedPoint={editedPoint}
              setEditedPoint={setEditedPoint}
              projectId={projectId}
              equipmentIdToPolyline={equipmentIdToPolyline}
              equipmentIdToVehiclePosition={equipmentIdToVehiclePosition}
              courses={courses}
              areas={areas}
              polylines={polylines}
              vehicles={vehicles}
              newVehicle={newVehicle}
              setNewVehicle={setNewVehicle}
              attentionPoints={attentionPoints}
              newAttentionPointPosition={newAttentionPointPosition}
              setNewAttentionPointPosition={setNewAttentionPointPosition}
              selectedCourseId={selectedCourseIdState}
              onSelectCourse={handleSelectCourse}
              selectedAreaId={selectedAreaIdState}
              onSelectArea={handleSelectArea}
              safetyEquipmentTypesName={safetyEquipmentTypesName}
              selectedEquipmentId={selectedEquipmentIdState}
              onSelectEquipment={handleSelectEquipment}
              isTimelinePlaying={isTimelinePlaying}
            />
          </div>

          {/* Timeline - Afficher uniquement si les dates du projet sont définies */}
          {projectStartTime && projectEndTime ? (
            <div className="w-full h-1/5 m-1">
              <Timeline
                projectStart={projectStartTime}
                projectEnd={projectEndTime}
                equipments={safetyEquipments}
                onActiveSafetyEquipmentsChange={
                  handleActiveSafetyEquipmentsChange
                }
                isPlaying={isTimelinePlaying}
                setIsPlaying={setIsTimelinePlaying}
              />
            </div>
          ) : (
            <div className="w-full h-1/5 mb-4 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">
                Aucune date de projet définie. Veuillez configurer les dates du
                projet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
