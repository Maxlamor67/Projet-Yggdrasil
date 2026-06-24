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

import type { Team } from "@/api";

type SelectEquipeProps = {
  projectId: string;
  value?: string;
  onChange: (equipeId: string) => void;
  disabled?: boolean;
};

export function SelectEquipe({
  projectId,
  value,
  onChange,
  disabled = false,
}: SelectEquipeProps) {
  const { data: teamsData, isLoading, isError } = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["teams", projectId],
      enabled: Boolean(projectId),
      queryFn: () => api.team.teamControllerFindAllV2(projectId),
      retry: 0,
    }),
    "GetTeams",
    "Impossible de charger les équipes"
  );

  // Assurance que teams est toujours un tableau
  const teams = Array.isArray(teamsData?.data) ? (teamsData.data as Team[]) : [];

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading || isError}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={
            isLoading ? "Chargement..." : isError ? "Erreur" : "Choisir une équipe"
          }
        />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="loading" disabled>
            Chargement...
          </SelectItem>
        )}

        {isError && (
          <SelectItem value="error" disabled>
            Erreur de chargement
          </SelectItem>
        )}

        {!isLoading && !isError && teams.length === 0 && (
          <SelectItem value="empty" disabled>
            Aucune équipe
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          teams.length > 0 &&
          teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
