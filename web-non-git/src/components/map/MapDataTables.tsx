import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import { EquipmentTable } from "@/components/equipments_table/EquipmentTable";
import { ParcoursTable } from "@/components/parcours_table/ParcoursTable";
import { ZonesTable } from "@/components/zones_table/ZonesTable";
import { PointsTable } from "@/components/point_table/PointsTable";

import type { LatLngTuple } from "leaflet";
import type { GetAllPointsToSecureResponse as PointToSecure } from "@/api";

type TabValue = "equipments" | "parcours" | "zones" | "points";

export function MapDataTables({
  projectId,
  selectedPoint,
  setSelectedPoint,
  onViewPosition,
  activeTab,
  setActiveTab,
  selectedCourseId,
  onSelectCourse,
  selectedAreaId,
  onSelectArea,
  selectedEquipmentId,
  onSelectEquipment,
  statusFilter,
  onStatusFilterChange,
}: {
  projectId: string;
  selectedPoint: PointToSecure | null;
  setSelectedPoint: (p: PointToSecure | null) => void;
  onViewPosition: (pos: LatLngTuple) => void;
  activeTab: TabValue;
  setActiveTab: (t: TabValue) => void;
  selectedCourseId: string | null;
  onSelectCourse: (id: string) => void;
  selectedAreaId: string | null;
  onSelectArea: (id: string) => void;
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string) => void;
  statusFilter: "all" | "traite" | "non_traite";
  onStatusFilterChange: (filter: "all" | "traite" | "non_traite") => void;
}) {
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList>
            <TabsTrigger value="equipments">Equipements</TabsTrigger>
            <TabsTrigger value="parcours">Parcours</TabsTrigger>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
          </TabsList>

          <TabsContent value="equipments">
            <EquipmentTable 
              projectId={projectId}
              selectedEquipmentId={selectedEquipmentId}
              onSelectEquipment={onSelectEquipment}
            />
          </TabsContent>

          <TabsContent value="parcours">
            <ParcoursTable 
              projectId={projectId}
              selectedCourseId={selectedCourseId}
              onSelectCourse={onSelectCourse}
            />
          </TabsContent>

          <TabsContent value="zones">
            <ZonesTable 
              projectId={projectId}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
            />
          </TabsContent>

          <TabsContent value="points">
            <PointsTable
              projectId={projectId}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              onViewPosition={onViewPosition}
              statusFilter={statusFilter}
              onStatusFilterChange={onStatusFilterChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
