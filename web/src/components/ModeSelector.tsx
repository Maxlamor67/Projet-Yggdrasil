import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface ModeSelectorProps {
  selectedMode: string | null;
  onModeChange: (value: string) => void;
  disabled: boolean;
}

export default function ModeSelector({ selectedMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <Select onValueChange={onModeChange} disabled={disabled} value={selectedMode ?? undefined}>
      <SelectTrigger className='w-3/4'>
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="course">Parcours</SelectItem>
        <SelectItem value="area">Zone</SelectItem>
        <SelectItem value="point">Points à sécuriser</SelectItem>
        <SelectItem value="equipment">Equipements</SelectItem>
        <SelectItem value="attentionPoint">Points d'attention</SelectItem>
      </SelectContent>
    </Select>
  );
}

