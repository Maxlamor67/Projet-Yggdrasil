import type { Project } from "@/api";
import { Timeline } from "@/components/TimelineSlider/Timeline";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/essai")({
  component: ProjectView,
});

function ProjectView() {
  // Ton projet
  const project: Project = {
    id: "1",
    name: "Projet Sécurisation JO 2026",
    startAtDate: "2026-01-12T00:00:00Z",
    endAtDate: "2026-01-18T23:59:59Z",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  };

  const handleTimeChange = (currentTime: Date) => {
    console.log("Temps actuel:", currentTime);
    // Ici tu vas filtrer les équipements plus tard
    // const visibleEquipments = equipments.filter(eq => {
    //   const poseDate = new Date(eq.datePose);
    //   const retraitDate = new Date(eq.dateRetrait);
    //   return currentTime >= poseDate && currentTime <= retraitDate;
    // });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar ou autre contenu (1/4) */}
      <div className="w-1/4 bg-slate-100 p-4">
        <h2>Sidebar</h2>
      </div>

      {/* Zone principale (3/4) */}
      <div className="flex h-full w-3/4 p-4 flex-col">
        {/* Map (4/5 de 3/4 = reste de la zone) */}
        <div className="flex-1 bg-gray-200 rounded-lg">
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Map sera ici
          </div>
        </div>
        {/* Timeline (1/5 de 3/4 = 1/4 de la zone principale) */}
        <div className="w-full h-1/4 mb-4">
          <Timeline
            projectStart={project.startAtDate!}
            projectEnd={project.endAtDate!}
            equipments={[]}
            onActiveSafetyEquipmentsChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
