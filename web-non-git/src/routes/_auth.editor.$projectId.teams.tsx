import ListViewer from "@/components/ListViewer";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api.ts";
import { authClient } from "@/lib/auth-client.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { useEffect, useState } from "react";
import type { Team, CreateTeamDto, UpdateTeamDto, User } from "@/api";
import TeamForm from "@/components/team/TeamForm.tsx";

import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_auth/editor/$projectId/teams")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();

  const [mode, setMode] = useState<
    | "createTeam"
    | "updateTeam"
    | "deleteTeam"
    | null
  >(null);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // TeamApi V2 est sous /projects/{projectId}
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const queryClient = useQueryClient();

  // ✅ on fixe le contexte projet automatiquement
  useEffect(() => {
    setSelectedProjectId(projectId);
  }, [projectId]);

  /**
   * USERS (via authClient.admin pour avoir la liste globale)
   */
  const getUsersQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["getUsers"],
      queryFn: async () =>
        await authClient.admin.listUsers({
          query: {
            sortBy: "name",
            sortDirection: "desc",
            filterField: "role",
            filterValue: "user",
            filterOperator: "eq",
          },
        }),
      retry: 0,
    }),
    "GetUsers",
    "Impossible de charger les utilisateurs"
  );

  /**
   * GET TEAM WITH MEMBERS (récupère la team avec sa liste de users)
   */
  const getTeamDetailQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["getTeamDetail", selectedProjectId, selectedTeam?.id],
      enabled: !!selectedProjectId && !!selectedTeam?.id,
      queryFn: async () => {
        const res = await api.team.teamControllerFindOneV2(
          selectedProjectId!,
          selectedTeam!.id
        );
        return res.data;
      },
      retry: 0,
    }),
    "GetTeamDetail",
    "Impossible de charger les d\u00e9tails de l'\u00e9quipe"
  );

  /**
   * TEAMS (V2 = sous /projects/{projectId})
   */
  const getTeamsQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["getTeamsV2", selectedProjectId],
      enabled: !!selectedProjectId,
      queryFn: async () => {
        const res = await api.team.teamControllerFindAllV2(selectedProjectId!);
        return res.data;
      },
      retry: 0,
    }),
    "GetTeams",
    "Impossible de charger les \u00e9quipes"
  );

  const createTeamMutation = useMutation({
    mutationFn: async (dto: CreateTeamDto) =>
      await api.team.teamControllerCreateV2(selectedProjectId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeamsV2", selectedProjectId],
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async (payload: { id: string; data: UpdateTeamDto }) =>
      await api.team.teamControllerUpdateV2(
        selectedProjectId!,
        payload.id,
        payload.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeamsV2", selectedProjectId],
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) =>
      await api.team.teamControllerRemoveV2(selectedProjectId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeamsV2", selectedProjectId],
      });
    },
  });

  /**
   * UI helpers
   */
  const openForm = (
    newMode: "createTeam" | "updateTeam" | "deleteTeam" | null,
    item?: Team
  ) => {
    setMode(newMode);

    if (!item) {
      setSelectedTeam(null);
      return;
    }

    setSelectedTeam(item);
  };

  const handleFormCancel = () => {
    setMode(null);
    setSelectedTeam(null);
  };

  /**
   * Team form submit handler :
   * - createTeam => CreateTeamDto (name + members[])
   * - updateTeam => UpdateTeamDto (name + addMembers[] + removeMembers[])
   */
  const handleTeamFormSubmit = (data: { name: string; memberIds: string[] }) => {
    if (!selectedProjectId) return;

    if (mode === "createTeam") {
      const dto: CreateTeamDto = {
        name: data.name,
        members: data.memberIds,
      };
      createTeamMutation.mutate(dto, { onSuccess: handleFormCancel });
    } else if (mode === "updateTeam" && selectedTeam) {
      // Déterminer les membres à ajouter et à supprimer
      const currentMembers = getTeamDetailQuery.data?.users?.map((u: any) => u.id) || [];
      const newMembers = data.memberIds;

      const addMembers = newMembers.filter((id: any) => !currentMembers.includes(id));
      const removeMembers = currentMembers.filter((id: any) => !newMembers.includes(id));

      const dto: UpdateTeamDto = {
        name: data.name,
        addMembers,
        removeMembers,
      };

      updateTeamMutation.mutate(
        { id: selectedTeam.id, data: dto },
        { onSuccess: handleFormCancel }
      );
    }
  };

  const handleTeamDelete = () => {
    if (!selectedTeam) return;
    deleteTeamMutation.mutate(selectedTeam.id, { onSuccess: handleFormCancel });
  };

  /**
   * Loading / error states
   */
  if (getTeamsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (getTeamsQuery.isError) {
    return <div>Error: {(getTeamsQuery.error as Error).message}</div>;
  }

  const mapUrl = `/editor/${projectId}/map`;

  return (
    <div className="w-full h-full p-4">
      <div>
        <Link to={mapUrl}>
          <Button variant="outline" className="m-4 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>

        <div className="w-full h-full">
          <ListViewer
            title="Equipes"
            showAvatar={false}
            items={getTeamsQuery.data || []}
            getId={(t: any) => t.id}
            getLabel={(t: any) => t.name}
            onAdd={() => openForm("createTeam")}
            onEdit={(t: any) => openForm("updateTeam", t)}
            onDelete={(t: any) => openForm("deleteTeam", t)}
          />
        </div>
      </div>

      <Dialog
        open={mode !== null}
        onOpenChange={(v) => {
          if (!v) handleFormCancel();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "createTeam" && "Ajouter une équipe"}
              {mode === "updateTeam" && "Modifier une équipe"}
              {mode === "deleteTeam" && "Supprimer une équipe"}
            </DialogTitle>
          </DialogHeader>

          {(mode === "createTeam" || mode === "updateTeam") && (
            <TeamForm
              team={selectedTeam}
              teamDetail={getTeamDetailQuery.data}
              availableUsers={
                (getUsersQuery.data?.data?.users as User[]) || []
              }
              onSubmit={handleTeamFormSubmit}
            />
          )}

          {mode === "deleteTeam" && (
            <div className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer l&apos;équipe{" "}
                <strong>{selectedTeam?.name}</strong> ?
              </p>
              <DialogFooter>
                <Button className='cursor-pointer' variant="outline" onClick={handleFormCancel}>
                  Annuler
                </Button>
                <Button
                  className='cursor-pointer'
                  variant="destructive"
                  type="button"
                  onClick={handleTeamDelete}
                >
                  Confirmer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
