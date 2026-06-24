import {useMemo} from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

import type { GetGeometryResponse } from "@/api";
import { ParcoursExpandedContent } from "./ParcoursExpandedContent";
import {getCourseColorById} from "@/components/map/CoursePolyline.tsx";

type Props = {
  parcours: GetGeometryResponse;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
};

export function ParcoursTableRow({
  parcours,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  onDeselect,
}: Props) {
  const color = useMemo(() => getCourseColorById(parcours.id), [parcours.id]);

  // route peut être undefined dans le type -> garde-fou
  const startDate = parcours.route?.startAt
    ? new Date(parcours.route.startAt)
    : null;

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
              "cursor-pointer transition-colors hover:bg-muted",
              isSelected && "bg-red-100"
            )}
            data-state={isSelected && "selected"}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                {parcours.name}
              </div>
            </TableCell>

            <TableCell>
              {startDate ? startDate.toLocaleDateString("fr-FR") : "—"}
            </TableCell>

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
            <TableCell colSpan={3} className="bg-muted/40 p-4">
              <ParcoursExpandedContent
                parcours={parcours}
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
