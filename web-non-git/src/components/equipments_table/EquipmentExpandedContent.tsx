"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type UiEquipment = {
  id: string;

  setAt: Date;
  unsetAt: Date;

  // optionnel mais cohérent avec le modèle
  setTeamId: string | null;
  unsetTeamId: string | null;
};

type Props = {
  equipment: UiEquipment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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

export function EquipmentExpandedContent({
  equipment,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto shadow-lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SET */}
          <div>
            <p className="font-medium text-muted-foreground">Date de pose</p>
            <p>{fmt(equipment.setAt)}</p>
          </div>

          {/* UNSET */}
          <div>
            <p className="font-medium text-muted-foreground">Date de retrait</p>
            <p>{fmt(equipment.unsetAt)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onEdit?.(equipment.id)}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>

          <Button
            variant="destructive"
            onClick={() => onDelete?.(equipment.id)}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}
