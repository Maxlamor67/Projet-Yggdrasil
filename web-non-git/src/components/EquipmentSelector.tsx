import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

import type { GetSafetyEquipmentTypeResponse } from "@/api";

interface EquipmentSelectorProps {
  safetyEquipmentTypes: GetSafetyEquipmentTypeResponse[];
  selectedSafetyEquipmentTypeLengthId: string | null;
  onEquipmentChange: (value: string) => void;
  disabled: boolean;
}

export default function EquipmentSelector({
  safetyEquipmentTypes,
  selectedSafetyEquipmentTypeLengthId,
  onEquipmentChange,
  disabled,
}: EquipmentSelectorProps) {
  return (
      <Select
          onValueChange={(value) => onEquipmentChange(value)}
          disabled={disabled}
          value={selectedSafetyEquipmentTypeLengthId ?? undefined}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type d'équipement" />
        </SelectTrigger>

        <SelectContent>
          {safetyEquipmentTypes.flatMap((t) =>
              (t.lengths ?? []).map((len) => (
                  <SelectItem key={len.id} value={len.id}>
                    {t.name} — {len.length}m
                  </SelectItem>
              ))
          )}
        </SelectContent>
      </Select>
  );
}
