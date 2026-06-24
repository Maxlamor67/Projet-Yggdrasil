"use client";

import { useEffect, useState } from "react";
import type {
  GetPointToSecureResponse,
  GetSafetyEquipmentTypeResponse,
  UpdatePointToSecureDto,
} from "@/api";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQuery } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  projectId: string;
  pointId: string | null;

  safetyEquipmentTypes: GetSafetyEquipmentTypeResponse[];

  onSave: (dto: UpdatePointToSecureDto) => void;
};

export function PointsEditSheet({
  open,
  onOpenChange,
  projectId,
  pointId,
  safetyEquipmentTypes,
  onSave,
}: Props) {
  const { data: detailsRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["pointToSecure", projectId, pointId],
      queryFn: () =>
        api.pointToSecure.pointToSecureControllerFindOneV2(projectId, pointId!),
      enabled: open && !!pointId,
      retry: 0,
    }),
    "GetPointToSecureDetails",
    "Impossible de charger les détails du point"
  );

  const details: GetPointToSecureResponse | undefined = detailsRes?.data;

  const [comment, setComment] = useState("");
  const [isTreated, setIsTreated] = useState(false);
  const [safetyEquipmentTypeId, setSafetyEquipmentTypeId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (!details) return;
    setComment(details.comment ?? "");
    setIsTreated(details.isTreated);
    setSafetyEquipmentTypeId(details.safetyEquipmentTypeId ?? undefined);
  }, [details]);

  const photos = details?.photos ?? [];

  if (!pointId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Modifier le point</SheetTitle>
        </SheetHeader>

        <div className="grid gap-6 px-4 py-4 flex-1 overflow-y-auto">
          {/* Traité */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isTreated}
              onCheckedChange={(v) => setIsTreated(Boolean(v))}
            />
            <Label>Traité</Label>
          </div>

          {/* Type équipement (optionnel) */}
          <div className="grid gap-2">
            <Label>Type d’équipement</Label>
            <Select
              value={safetyEquipmentTypeId ?? "__none__"}
              onValueChange={(v) => {
                if (v === "__none__") setSafetyEquipmentTypeId(undefined);
                else setSafetyEquipmentTypeId(v);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="— Aucun —" />
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

          {/* Commentaire */}
          <div className="grid gap-2">
            <Label>Commentaire</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Commentaire terrain..."
            />
          </div>

          {/* Photos (readonly) */}
          <div className="grid gap-2">
            <Label>Photos</Label>

            {photos.length ? (
              <div className="flex gap-2 overflow-x-auto">
                {photos.map((ph) => {
                  const src = `${
                    import.meta.env.VITE_HTTP_API_URL
                  }/v2/projects/${projectId}/points-to-secure/${pointId}/photos/${
                    ph.id
                  }`;

                  return (
                    <div
                      key={ph.id}
                      className="h-24 w-24 rounded-md border overflow-hidden bg-muted"
                    >
                      <img
                        src={src}
                        alt="Photo"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune photo associée.
              </p>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button
            className='hover:cursor-pointer'
            onClick={() => {
              const dto: UpdatePointToSecureDto = {
                comment: comment.length ? comment : undefined,
                isTreated,
                ...(safetyEquipmentTypeId ? { safetyEquipmentTypeId } : {}),
              };

              onSave(dto);
              onOpenChange(false);
            }}
          >
            Sauvegarder
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
