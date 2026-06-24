import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { useState, useEffect } from "react";
import ListViewer from "@/components/ListViewer";
import { Button } from "@/components/ui/button";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_auth/dashboard/equipments")({
  component: SafetyEquipmentTypePage,
});

// Schéma de validation pour les types d'équipements de sécurité
const safetyEquipmentTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  model: z.enum(["VEHICLE", "OBSTACLE"] as const),
  lengths: z
    .array(z.object({ length: z.string().min(1, "Longueur requise") }))
    .min(1, "Au moins une longueur est requise"),
});

type SafetyEquipmentTypeFormData = z.infer<typeof safetyEquipmentTypeSchema>;

interface SafetyEquipmentTypeLength {
  id: string;
  safetyEquipmentTypeId: string;
  length: number;
  createdAt: string;
}

interface SafetyEquipmentType {
  id: string;
  name: string;
  model: "VEHICLE" | "OBSTACLE";
  createdAt: string;
  lengths: SafetyEquipmentTypeLength[];
}

function SafetyEquipmentTypePage() {
  const queryClient = useQueryClient();
  const { showError } = useError();

  // État local
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [selectedEquipmentType, setSelectedEquipmentType] =
    useState<SafetyEquipmentType | null>(null);

  // Replace hardcoded data fetching with API call
  const getEquipmentTypeQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentType"],
      queryFn: async () => {
        const response = await api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2();
        return response.data;
      },
      retry: 0,
    }),
    "GetEquipmentType",
    "Impossible de charger les types d'équipements"
  );

  // ======================================
  // MUTATIONS - Equipment Types
  // ======================================
  // Replace create mutation with API call
  const createEquipmentTypeMutation = useMutation({
    mutationFn: async (data: SafetyEquipmentTypeFormData) => {
      const response = await api.safetyEquipmentType.safetyEquipmentTypeControllerCreateV2({
        name: data.name,
        model: data.model,
        lengths: data.lengths.map((l) => ({ length: parseFloat(l.length) })),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyEquipmentType"] });
      toast.success("Type d'équipement créé avec succès");
    },
    onError: (error) => {
      logError(error, "CreateEquipmentType");
      const errorInfo = processAxiosError(
        error,
        "Impossible de créer le type d'équipement"
      );
      showError(errorInfo);
    },
  });

  // Update the update mutation to handle name updates and manage lengths
  const updateEquipmentTypeMutation = useMutation({
    mutationFn: async (data: SafetyEquipmentTypeFormData) => {
      // Update the name of the safety equipment type
      await api.safetyEquipmentType.safetyEquipmentTypeControllerUpdateV2(
        selectedEquipmentType!.id,
        {
          name: data.name,
        }
      );

      // Determine added and removed lengths
      const currentLengths = selectedEquipmentType!.lengths.map((l) => l.length);
      const submittedLengths = data.lengths.map((l) => parseFloat(l.length));

      const lengthsToAdd = submittedLengths.filter((l) => !currentLengths.includes(l));
      const lengthsToRemove = selectedEquipmentType!.lengths.filter(
        (l) => !submittedLengths.includes(l.length)
      );

      // Add new lengths
      for (const length of lengthsToAdd) {
        await api.length.lengthControllerCreateV2(selectedEquipmentType!.id, { length });
      }

      // Remove deleted lengths
      for (const length of lengthsToRemove) {
        await api.length.lengthControllerRemoveV2(selectedEquipmentType!.id, length.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyEquipmentType"] });
      toast.success("Type d'équipement modifié avec succès");
    },
    onError: (error) => {
      logError(error, "UpdateEquipmentType");
      const errorInfo = processAxiosError(
        error,
        "Impossible de modifier le type d'équipement"
      );
      showError(errorInfo);
    },
  });

  // Replace delete mutation with API call
  const deleteEquipmentTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.safetyEquipmentType.safetyEquipmentTypeControllerRemoveV2(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safetyEquipmentType"] });
      toast.success("Type d'équipement supprimé avec succès");
    },
    onError: (error) => {
      logError(error, "DeleteEquipmentType");
      const errorInfo = processAxiosError(
        error,
        "Impossible de supprimer le type d'équipement"
      );
      showError(errorInfo);
    },
  });

  // ======================================
  // FORM
  // ======================================
  const form = useForm<SafetyEquipmentTypeFormData>({
    resolver: zodResolver(safetyEquipmentTypeSchema),
    defaultValues: selectedEquipmentType
      ? {
          id: selectedEquipmentType.id,
          name: selectedEquipmentType.name,
          model: selectedEquipmentType.model,
          lengths: selectedEquipmentType.lengths.map((l) => ({ length: l.length.toString() })),
        }
      : {
          name: "",
          model: "OBSTACLE",
          lengths: [{ length: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lengths",
  });

  // ======================================
  // UI HANDLERS
  // ======================================
  const openCreateForm = () => {
    setSelectedEquipmentType(null);
    form.reset({
      name: "",
      model: "OBSTACLE",
      lengths: [{ length: "" }],
    });
    setMode("create");
  };

  const openEditForm = (equipmentType: SafetyEquipmentType) => {
    setSelectedEquipmentType(equipmentType);
    form.reset({
      id: equipmentType.id,
      name: equipmentType.name,
      model: equipmentType.model,
      lengths: equipmentType.lengths.map((l) => ({ length: l.length.toString() })),
    });
    setMode("edit");
  };

  const handleDelete = (equipmentType: SafetyEquipmentType) => {
    deleteEquipmentTypeMutation.mutate(equipmentType.id);
  };

  const handleFormCancel = () => {
    setMode(null);
    setSelectedEquipmentType(null);
    form.reset();
  };

  const handleFormSubmit = (data: SafetyEquipmentTypeFormData) => {
    if (mode === "create") {
      createEquipmentTypeMutation.mutate(data, {
        onSuccess: handleFormCancel,
      });
      return;
    }

    if (mode === "edit" && selectedEquipmentType) {
      updateEquipmentTypeMutation.mutate(data, {
        onSuccess: handleFormCancel,
      });
    }
  };

  if (getEquipmentTypeQuery.isLoading && !getEquipmentTypeQuery.error) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full p-4 h-screen">
      <ListViewer
        items={(getEquipmentTypeQuery.data as SafetyEquipmentType[]) || []}
        getId={(e) => e.id}
        getLabel={(e) => `${e.name} (${e.model})`}
        title="Types d'équipements de sécurité"
        filters={["All"]}
        onAdd={openCreateForm}
        onEdit={openEditForm}
        onDelete={handleDelete}
      />

      <Dialog open={mode !== null} onOpenChange={(v) => !v && handleFormCancel()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Créer un équipement"
                : "Modifier un équipement"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'équipement</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Cône de signalisation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={mode === "edit"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un modèle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OBSTACLE">Obstacle</SelectItem>
                          <SelectItem value="VEHICLE">Véhicule</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <FormLabel>Longueurs (en mètres)</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ length: "" })}
                    className='cursor-pointer'
                  >
                    <Plus className="size-4 mr-1" />
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <FormField
                        control={form.control}
                        name={`lengths.${index}.length`}
                        render={({ field: lengthField }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 1.5"
                                {...lengthField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        className='cursor-pointer'
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {form.formState.errors.lengths && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.lengths.message}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  className='cursor-pointer'
                  type="button"
                  variant="outline"
                  onClick={handleFormCancel}
                >
                  Annuler
                </Button>
                <Button className='cursor-pointer' type="submit">
                  {mode === "create" ? "Créer" : "Modifier"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
