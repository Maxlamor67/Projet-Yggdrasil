import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import type {
  CreatePointToSecureDto,
  GetSafetyEquipmentTypeResponse,
} from "@/api";
import { api } from "@/lib/api";
import { useError } from "@/contexts/ErrorContext";
import { processAxiosError, logError } from "@/utils/error";
import { toast } from "sonner";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LatLngTuple } from "leaflet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PointCreationForm({
  latitude,
  longitude,
  setNewPointPosition,
  setDrawingMode,
  projectId,
}: {
  latitude: number;
  longitude: number;
  setNewPointPosition: (p: LatLngTuple | null) => void;
  setDrawingMode: (mode: string | null) => void;
  projectId: string;
}) {
  const queryClient = useQueryClient();
  const { showError } = useError();
  const formRef = useRef<HTMLFormElement>(null);

  const [isTreated, setIsTreated] = useState<boolean>(false);
  const [safetyEquipmentTypeId, setSafetyEquipmentTypeId] = useState<
    string | undefined
  >(undefined);

  // Récupération des types d'équipements de sécurité
  const { data: safetyEquipmentTypesRes, isLoading: isLoadingTypes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentTypes"],
      queryFn: () => api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2(),
      retry: 0,
    }),
    "GetSafetyEquipmentTypes",
    "Impossible de charger les types d'équipements"
  );

  const safetyEquipmentTypes: GetSafetyEquipmentTypeResponse[] =
    (safetyEquipmentTypesRes?.data ?? []) as GetSafetyEquipmentTypeResponse[];

  const createPointMutation = useMutation({
    mutationFn: (dto: CreatePointToSecureDto) =>
      api.pointToSecure.pointToSecureControllerCreateV2(projectId, dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pointsToSecure", projectId],
      });

      formRef.current?.reset();
      setSafetyEquipmentTypeId(undefined);
      setIsTreated(false);

      setNewPointPosition(null);
      setDrawingMode(null);
      
      toast.success("Point créé avec succès");
    },
    onError: (error) => {
      logError(error, "CreatePoint");
      const errorInfo = processAxiosError(
        error,
        "Impossible de créer le point"
      );
      showError(errorInfo);
    },
  });

  const handleCancel = () => {
    setNewPointPosition(null);
    setDrawingMode(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const dto: CreatePointToSecureDto = {
      point: {
        latitude,
        longitude,
      },
      comment: (form.get("comment") as string) || undefined,
      isTreated,
      ...(safetyEquipmentTypeId ? { safetyEquipmentTypeId } : {}),
    };

    createPointMutation.mutate(dto);
  };

  return (
    <Card className="flex flex-col gap-2 shadow-xl border-0 p-0">
      <CardTitle className="bg-black text-white text-center rounded-t-lg px-6 py-2">
        Création d&apos;un point à sécuriser
      </CardTitle>

      <CardContent className="px-4 py-1">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Commentaire */}
          <div className="flex flex-col gap-1">
            <Label>Commentaire</Label>
            <Input name="comment" />
          </div>

          {/* Type équipement (optionnel) */}
          <div className="flex flex-col gap-1">
            <Label>Type d’équipement (optionnel)</Label>

            <Select
              value={safetyEquipmentTypeId ?? "__none__"}
              onValueChange={(v) => {
                if (v === "__none__") setSafetyEquipmentTypeId(undefined);
                else setSafetyEquipmentTypeId(v);
              }}
              disabled={isLoadingTypes}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isLoadingTypes ? "Chargement..." : "— Aucun —"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Aucun —</SelectItem>
                {safetyEquipmentTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Traité */}
          <div className="flex flex-col gap-1">
            <Label>Traité</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isTreated ? "default" : "outline"}
                onClick={() => setIsTreated(true)}
                className="w-1/2"
              >
                Oui
              </Button>
              <Button
                type="button"
                variant={!isTreated ? "default" : "outline"}
                onClick={() => setIsTreated(false)}
                className="w-1/2"
              >
                Non
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="w-1/2 cursor-pointer"
              type="button"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button
              className="w-1/2 cursor-pointer"
              type="submit"
              disabled={createPointMutation.isPending}
            >
              {createPointMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
