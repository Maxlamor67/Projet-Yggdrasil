import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SelectEquipe } from "@/components/SelectEquipe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { generatePlanningPdf } from "@/lib/planningPdfGenerator";
import type { Planning } from "@/types/planning";
import { useQuery } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";
import { useMapStore } from "@/stores/mapStore";

import type {
  Team,
  ActionsAndSafetyEquipmentTypeLength,
} from "@/api";

export const Route = createFileRoute("/_auth/editor/$projectId/planning")({
  component: PlanningPage,
});

function PlanningPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedEquipeId, setSelectedEquipeId] = useState<string>("");

  // Récupérer le screenshot de la carte depuis le store
  const mapScreenshot = useMapStore((state) => state.mapScreenshot);

  // ✅ Récupérer les équipes depuis l'API (V2 + scope projet)
  const { data: teamsData } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["teams", projectId],
      queryFn: () => api.team.teamControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetTeams",
    "Impossible de charger les \u00e9quipes"
  );

  const teams = (teamsData?.data ?? []) as Team[];

  // ✅ Récupérer le planning de l'équipe sélectionnée (V2)
  const { data: planningData } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["teamPlanning", projectId, selectedEquipeId],
      enabled: Boolean(projectId && selectedEquipeId),
      queryFn: () =>
        api.team.teamControllerFindOnePlanningV2(projectId, selectedEquipeId),
      retry: 0,
    }),
    "GetTeamPlanning",
    "Impossible de charger le planning"
  );

  const planningItems = (planningData?.data ?? []) as ActionsAndSafetyEquipmentTypeLength[];

  // Créer le planning à partir de la réponse /teams/{id}/planning
  const selectedPlanning: Planning | undefined = useMemo(() => {
    if (!selectedEquipeId) return undefined;

    const selectedTeam = teams.find((t) => t.id === selectedEquipeId);
    if (!selectedTeam) return undefined;

    const actions: Planning["actions"] = [];
    const itinerary: Planning["itinerary"] = [];

    // Itinéraire: concat points des safetyEquipments (triés par rank)
    planningItems.forEach((item) => {
      const pts = (item.safetyEquipmentPoints ?? [])
        .slice()
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

      pts.forEach((p) => {
        itinerary.push({
          latitude: p.point.latitude,
          longitude: p.point.longitude,
        });
      });
    });

    // Actions: pour chaque safetyEquipment, on génère une ligne par action (SET/UNSET)
    planningItems.forEach((item) => {
      const equipmentName =
        item.safetyEquipmentTypeLength?.safetyEquipmentType?.name ?? "Équipement";

      const length = item.safetyEquipmentTypeLength?.length ?? null;
      const quantity = item.safetyEquipmentTypeLengthCount ?? 0;

      // Position associée à l'action: on prend le 1er point (rank min) si dispo
      const firstPoint = (item.safetyEquipmentPoints ?? [])
        .slice()
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))[0]?.point;

      const latitude = firstPoint?.latitude ?? 0;
      const longitude = firstPoint?.longitude ?? 0;

      (item.actions ?? []).forEach((a) => {
        const dt = new Date(a.realizedAt);

        actions.push({
          id: a.id,
          date: dt.toLocaleDateString("fr-FR"),
          time: dt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: a.type === "SET" ? "Pose" : "Retrait",
          equipmentName,
          length,
          quantity,
          latitude,
          longitude,
        });
      });
    });

    // Trier les actions par timestamp réel (reconstruit à partir de date+time FR = fragile)
    // => on retrie en recalculant avec un Date basé sur realizedAt original est impossible ici (perdu),
    // donc on trie par (date,time) mais en ISO local. (suffisant pour l'UI)
    actions.sort((a, b) => {
      const [dA, mA, yA] = a.date.split("/").map(Number);
      const [hA, minA] = a.time.split(":").map(Number);
      const [dB, mB, yB] = b.date.split("/").map(Number);
      const [hB, minB] = b.time.split(":").map(Number);

      const dateA = new Date(yA, mA - 1, dA, hA, minA);
      const dateB = new Date(yB, mB - 1, dB, hB, minB);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      id: `planning-${selectedEquipeId}`,
      equipe: {
        id: selectedTeam.id,
        name: selectedTeam.name,
        eventId: "",
        employes: [],
      },
      actions,
      itinerary,
    };
  }, [selectedEquipeId, teams, planningItems]);

  const handleGeneratePlanning = () => {
    if (!selectedPlanning) return;
    generatePlanningPdf(selectedPlanning, mapScreenshot);
  };

  const mapUrl = `/editor/${projectId}/map`;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col p-8">
      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        {/* Bouton retour */}
        <Button
          variant="outline"
          className="mb-6 cursor-pointer"
          onClick={() => navigate({ to: mapUrl })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la Carte
        </Button>

        {/* Titre Planning */}
        <h1 className="text-4xl font-bold mb-6">Planning</h1>

        {/* Layout en grille */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
            {/* Section Choix Équipe + Génération */}
            <Card>
              <CardHeader>
                <CardTitle>Génération de planning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Choix Équipe</label>
                  <SelectEquipe
                    projectId={projectId}
                    value={selectedEquipeId}
                    onChange={setSelectedEquipeId}
                  />
                </div>

                <Button
                  onClick={handleGeneratePlanning}
                  disabled={!selectedEquipeId}
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Générer planning
                </Button>

                {!selectedEquipeId && (
                  <p className="text-sm text-muted-foreground text-center">
                    Veuillez choisir une équipe pour générer le planning
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Aperçu du planning sélectionné */}
            {selectedPlanning && (
              <Card>
                <CardHeader>
                  <CardTitle>Aperçu - {selectedPlanning.equipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-3">Actions planifiées:</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Heure</th>
                          <th className="text-left p-2">Action</th>
                          <th className="text-left p-2">Équipement</th>
                          <th className="text-left p-2">Longueur</th>
                          <th className="text-left p-2">Quantité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlanning.actions.map((actionItem) => (
                          <tr
                            key={actionItem.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-2">{actionItem.date}</td>
                            <td className="p-2">{actionItem.time}</td>
                            <td className="p-2">{actionItem.action}</td>
                            <td className="p-2">{actionItem.equipmentName}</td>
                            <td className="p-2">{actionItem.length || "-"}</td>
                            <td className="p-2">{actionItem.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Carte */}
          <div>
            {mapScreenshot && (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Zone d'intervention</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={mapScreenshot}
                    alt="Carte de la zone d'intervention"
                    className="w-full h-auto rounded border"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
