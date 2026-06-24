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
import { ZonesExpandedContent } from "./ZonesExpandedContent";
import {getAreaColorById} from "@/components/map/AreaPolyline.tsx";

type Props = {
  zone: GetGeometryResponse;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
};

export function ZonesTableRow({
  zone,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  onDeselect,
}: Props) {
  const color = useMemo(() => getAreaColorById(zone.id), [zone.id]);

  const createdDate = zone.createdAt ? new Date(zone.createdAt) : null;

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
                {zone.name}
              </div>
            </TableCell>

            <TableCell>
              {createdDate ? createdDate.toLocaleDateString("fr-FR") : "—"}
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
              <ZonesExpandedContent
                zone={zone}
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
