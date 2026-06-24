import ListViewer from "@/components/ListViewer";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { authClient } from "@/lib/auth-client.ts";
import { api } from "@/lib/api.ts";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { useState } from "react";
import UserForm, {type UserFormData} from "@/components/user/UserForm.tsx";
import type { User } from "better-auth";
import type { Project } from "@/api";

export const Route = createFileRoute("/_auth/dashboard/people")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mode, setMode] = useState<
    | "createMember"
    | "updateMember"
    | "deleteMember"
    | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();
  const { showError } = useError();

  /**
   * USERS
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

  const createUserMutation = useMutation({
    mutationFn: async ({ name, email, phone }: { name: string; email: string; phone?: string }) =>
      await authClient.admin.createUser({
        name,
        email,
        password: "",
        data: {
          phone,
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      toast.success("Utilisateur créé avec succès");
    },
    onError: (error) => {
      logError(error, "CreateUser");
      const errorInfo = processAxiosError(
        error,
        "Impossible de créer l'utilisateur"
      );
      showError(errorInfo);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ name, email, phone }: { name: string; email: string; phone?: string }) =>
      await authClient.admin.updateUser({
        userId: selectedUser!.id,
        data: {
          name,
          email,
          phone: phone || null,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      toast.success("Utilisateur modifié avec succès");
    },
    onError: (error) => {
      logError(error, "UpdateUser");
      const errorInfo = processAxiosError(
        error,
        "Impossible de modifier l'utilisateur"
      );
      showError(errorInfo);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () =>
      await authClient.admin.removeUser({
        userId: selectedUser!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
      toast.success("Utilisateur supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteUser");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer l'utilisateur"
      );
      showError(errorInfo);
    },
  });

  /**
   * PROJECTS (pour sélectionner le contexte teams V2)
   */
  const getProjectsQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["getProjectsV2"],
      queryFn: async () => {
        const res = await api.project.projectControllerFindAllV2();
        return res.data as Project[];
      },
      retry: 0,
    }),
    "GetProjectsPeople",
    "Impossible de charger les projets"
  );

  /**
   * UI helpers
   */
  const openForm = (
    newMode:
      | "createMember"
      | "updateMember"
      | "deleteMember"
      | null,
    item?: User
  ) => {
    setMode(newMode);
    setSelectedUser(item || null);
  };

  const handleFormCancel = () => {
    setMode(null);
    setSelectedUser(null);
  };

  const handleUserFormSubmit = (data: UserFormData) => {
    if (mode === "createMember") {
      createUserMutation.mutate(data, { onSuccess: handleFormCancel });
    } else if (mode === "updateMember" && selectedUser) {
      updateUserMutation.mutate(
        data,
        { onSuccess: handleFormCancel }
      );
    }
  };

  const handleUserFormDelete = () => {
    deleteUserMutation.mutate(undefined, { onSuccess: handleFormCancel });
  };

  /**
   * Loading / error states
   */
  if (
    getUsersQuery.isLoading ||
    getProjectsQuery.isLoading
  ) {
    return <div>Loading...</div>;
  }

  if (getUsersQuery.isError) {
    return <div>Error: {(getUsersQuery.error as Error).message}</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <div>
        <div className="w-full h-full">
          <ListViewer
            title="Personnes"
            items={getUsersQuery.data?.data?.users || []}
            getId={(p: any) => p.id}
            getLabel={(p: any) => p.name}
            onAdd={() => openForm("createMember")}
            onEdit={(p: any) => openForm("updateMember", p)}
            onDelete={(p: any) => openForm("deleteMember", p)}
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
              {mode === "createMember" && "Ajouter une personne"}
              {mode === "updateMember" && "Modifier une personne"}
              {mode === "deleteMember" && "Supprimer une personne"}
            </DialogTitle>
          </DialogHeader>

          {/* Member Dialog */}
          {(mode === "createMember" || mode === "updateMember") && (
            <UserForm
              mode={mode === "createMember" ? "create" : "edit"}
              initialState={
                mode === "createMember"
                  ? null
                  : {
                      name: selectedUser?.name || "",
                      email: selectedUser?.email || "",
                      phone: (selectedUser as any)?.phone as string || "",
                    }
              }
              onSubmit={handleUserFormSubmit}
            />
          )}

          {/* Member Dialog */}
          {mode === "deleteMember" && (
            <div className="space-y-4">
              <p>
                Êtes-vous sûr de vouloir supprimer{" "}
                <strong>{selectedUser?.name}</strong> ?
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={handleFormCancel}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleUserFormDelete}
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
