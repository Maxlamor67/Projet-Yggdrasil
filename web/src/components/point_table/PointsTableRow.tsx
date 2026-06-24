"use client";

import { useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { api } from "@/lib/api";

import type {
  GetAllPointsToSecureResponse as PointToSecure,
  GetSafetyEquipmentTypeResponse,
} from "@/api";
import { PointsExpandedContent } from "./PointsExpandedContent";

type Props = {
  point: PointToSecure;

  // sélection (synchro table <-> map)
  isSelected: boolean;
  onSelect: () => void;
  onDeselect?: () => void;

  // actions
  onEdit: () => void;
  onDelete: () => void;

  // toggle traité
  onToggleTreated?: (next: boolean) => void;
};

export function PointsTableRow({
  point,
  isSelected,
  onSelect,
  onDeselect,
  onEdit,
  onDelete,
  onToggleTreated,
}: Props) {
  // 1) Récupère la liste des types (mise en cache par react-query)
  const { data: typesRes } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["safetyEquipmentTypes"],
      queryFn: () => api.safetyEquipmentType.safetyEquipmentTypeControllerFindAllV2(),
      staleTime: 60 * 60 * 1000, // 1h
      retry: 0,
    }),
    "GetSafetyEquipmentTypes",
    "Impossible de charger les types d'équipements"
  );

  // 2) Map id -> label
  const typesById = useMemo(() => {
    const list = (typesRes?.data ?? []) as GetSafetyEquipmentTypeResponse[];
    const m: Record<string, string> = {};
    for (const t of list) m[t.id] = t.name;
    return m;
  }, [typesRes?.data]);

  // 3) Affichage label (fallback id si pas chargé)
  const equip = point.safetyEquipmentTypeId
    ? typesById[point.safetyEquipmentTypeId] ?? point.safetyEquipmentTypeId
    : "—";

  // Gère le clic sur le chevron pour ouvrir/fermer
  const handleRowClick = () => {
    if (isSelected) {
      onDeselect?.();
    } else {
      onSelect();
    }
  };

  const handleCellSelectOnly = () => {
    if (!isSelected) {
      onSelect();
    }
  };

  return (
    <>
      {/* Row compacte */}
      <TableRow
        data-state={isSelected ? "selected" : undefined}
        className={clsx(
          "cursor-default",
          isSelected && "bg-red-100",
          isSelected && "border-b-0"
        )}
      >
        <TableCell>
          <Checkbox
            checked={Boolean(point.isTreated)}
            onCheckedChange={(checked) => onToggleTreated?.(Boolean(checked))}
            onClick={(e) => e.stopPropagation()} // évite d'ouvrir/fermer en cliquant la checkbox
          />
        </TableCell>

        <TableCell className="cursor-pointer" onClick={handleCellSelectOnly}>
          {equip}
        </TableCell>

        <TableCell className="text-right cursor-pointer" onClick={handleRowClick}>
          <ChevronDown
            className={clsx(
              "inline h-4 w-4 transition-transform",
              isSelected && "rotate-180"
            )}
          />
        </TableCell>
      </TableRow>

      {/* Row étendue */}
      {isSelected && (
        <TableRow className="bg-red-100">
          <TableCell colSpan={4} className="bg-muted/40 p-4">
            <PointsExpandedContent
              projectId={point.projectId}
              pointId={point.id}
              pointListItem={point}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
