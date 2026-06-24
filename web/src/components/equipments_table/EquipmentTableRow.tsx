"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { EquipmentExpandedContent } from "./EquipmentExpandedContent";

type UiEquipment = {
  id: string;
  label: string;
  count: number;

  setAt: Date;
  unsetAt: Date;

  setTeamId: string | null;
  unsetTeamId: string | null;

  safetyEquipmentTypeLengthId: string;
  points: Array<{ latitude: number; longitude: number; rank: number }>;
};

type Props = {
  equipment: UiEquipment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
  isChecked?: boolean;
  onCheck?: () => void;
};

function fmt(d: Date) {
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EquipmentTableRow({
  equipment,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  onDeselect,
  isChecked = false,
  onCheck,
}: Props) {
  // Gère l'ouverture/fermeture du collapsible lié à la sélection
  const handleOpenChange = (open: boolean) => {
    if (open) {
      onSelect?.();
    } else {
      onDeselect?.();
    }
  };

  return (
    <Collapsible open={isSelected} onOpenChange={handleOpenChange} asChild>
      <>
        <CollapsibleTrigger asChild>
          <TableRow
            className={clsx(
              "cursor-pointer transition-colors",
              isSelected && "bg-red-100"
            )}
            data-state={isSelected && "selected"}
          >
            <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isChecked}
                onCheckedChange={onCheck}
              />
            </TableCell>

            <TableCell>
              {equipment.label} (x{equipment.count})
            </TableCell>

            <TableCell>{fmt(equipment.setAt)}</TableCell>

            <TableCell className="text-right">
              <ChevronDown
                className={clsx(
                  "inline h-4 w-4 transition-transform",
                  isSelected && "rotate-180"
                )}
              />
            </TableCell>
          </TableRow>
        </CollapsibleTrigger>

        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={4} className="bg-muted/40 p-4">
              <EquipmentExpandedContent
                equipment={equipment}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}
