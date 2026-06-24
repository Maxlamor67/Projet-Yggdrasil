import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Team } from "@/api";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId: string | null;
  onTeamChange: (teamId: string) => void;
  disabled: boolean;
  placeholder: string;
}

export default function TeamSelector({
  teams,
  selectedTeamId,
  onTeamChange,
  disabled,
  placeholder,
}: TeamSelectorProps) {
  return (
    <Select
      onValueChange={(value) => onTeamChange(value)}
      disabled={disabled}
      value={selectedTeamId ?? undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
