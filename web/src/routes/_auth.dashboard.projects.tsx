// src/routes/projects.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";

import { useState } from "react";
import ListViewer from "@/components/ListViewer";
import { ProjectForm } from "@/components/projects/ProjectForm";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Project, CreateProjectDto, UpdateProjectDto } from "@/api";

export const Route = createFileRoute("/_auth/dashboard/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showError } = useError();

  // ----------------------------------------------
  // LOAD PROJECTS (V2)
  // ----------------------------------------------
  const getProjectsQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["projects", "v2"],
      queryFn: async () => {
        const res = await api.project.projectControllerFindAllV2();
        return res.data;
      },
      retry: 0,
    }),
    "GetProjects",
    "Impossible de charger les projets"
  );

  // ----------------------------------------------
  // MUTATIONS (V2)
  // ----------------------------------------------
  const createProject = useMutation({
    mutationFn: (dto: CreateProjectDto) =>
        api.project.projectControllerCreateV2(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects", "v2"] });
      toast.success("Projet créé avec succès");
    },
    onError: (error) => {
      logError(error, "CreateProject");
      const errorInfo = processAxiosError(
        error,
        "Impossible de créer le projet"
      );
      showError(errorInfo);
    },
  });

  const updateProject = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateProjectDto }) =>
        api.project.projectControllerUpdateV2(payload.id, payload.dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects", "v2"] });
      toast.success("Projet modifié avec succès");
    },
    onError: (error) => {
      logError(error, "UpdateProject");
      const errorInfo = processAxiosError(
        error,
        "Impossible de modifier le projet"
      );
      showError(errorInfo);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => api.project.projectControllerRemoveV2(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects", "v2"] });
      toast.success("Projet supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteProject");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer le projet"
      );
      showError(errorInfo);
    },
  });

  // ----------------------------------------------
  // UI local state
  // ----------------------------------------------
  const [mode, setMode] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openCreateForm = () => {
    setSelectedProject(null);
    setMode("create");
  };

  const openEditForm = (project: Project) => {
    setSelectedProject(project);
    setMode("edit");
  };

  const openDeleteConfirm = (project: Project) => {
    setSelectedProject(project);
    setMode("delete");
  };

  const handleDelete = () => {
    if (!selectedProject) return;
    deleteProject.mutate(selectedProject.id, {
      onSuccess: handleFormCancel,
    });
  };

  const handleFormCancel = () => {
    setMode(null);
    setSelectedProject(null);
  };

  const handleFormSubmit = (data: CreateProjectDto | UpdateProjectDto) => {
    if (mode === "create") {
      createProject.mutate(data as CreateProjectDto, {
        onSuccess: handleFormCancel,
      });
      return;
    }

    if (mode === "edit" && selectedProject) {
      updateProject.mutate(
          { id: selectedProject.id, dto: data as UpdateProjectDto },
          { onSuccess: handleFormCancel }
      );
    }
  };

  if (getProjectsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="flex flex-col gap-4 w-full p-4 h-screen">

        <ListViewer
            items={getProjectsQuery.data || []}
            getId={(p) => p.id}
            getLabel={(p) => p.name}
            title="Projets"
            filters={["All"]}
            onAdd={openCreateForm}
            onEdit={openEditForm}
            onDelete={openDeleteConfirm}
            onItemClick={(p) =>
                router.navigate({
                  to: `/editor/$projectId/map`,
                  params: { projectId: p.id },
                })
            }
        />

        <Dialog open={mode !== null} onOpenChange={(v) => !v && handleFormCancel()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {mode === "create" && "Créer un projet"}
                {mode === "edit" && "Modifier un projet"}
                {mode === "delete" && "Supprimer un projet"}
              </DialogTitle>
            </DialogHeader>

            {(mode === "create" || mode === "edit") && (
                <ProjectForm
                    mode={mode === "create" ? "create" : "edit"}
                    project={selectedProject}
                    onCancel={handleFormCancel}
                    onSubmit={handleFormSubmit}
                />
            )}

            {mode === "delete" && (
                <div className="space-y-4">
                  <p>
                    Êtes-vous sûr de vouloir supprimer le projet{" "}
                    <strong>{selectedProject?.name}</strong> ?
                  </p>
                  <DialogFooter>
                    <Button className="cursor-pointer" variant="outline" onClick={handleFormCancel}>
                      Annuler
                    </Button>
                    <Button
                        className="cursor-pointer"
                        variant="destructive"
                        type="button"
                        onClick={handleDelete}
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
