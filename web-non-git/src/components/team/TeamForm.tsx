import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useEffect, useState } from "react";
import type { Team, User, GetTeamResponse } from "@/api";

interface TeamFormProps {
  team?: Team | null;
  teamDetail?: GetTeamResponse | null;
  availableUsers?: User[];
  onSubmit: (data: { name: string; memberIds: string[] }) => void;
}

export default function TeamForm({
  team,
  teamDetail,
  availableUsers = [],
  onSubmit,
}: TeamFormProps) {
  const [teamName, setTeamName] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      // Si on a les détails de la team, on récupère les IDs des membres actuels
      if (teamDetail?.users) {
        setSelectedMemberIds(teamDetail.users.map((u) => u.id));
      }
    } else {
      setTeamName("");
      setSelectedMemberIds([]);
    }
  }, [team, teamDetail]);

  const handleMemberToggle = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: teamName,
      memberIds: selectedMemberIds,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team-name">Nom</Label>
            <Input
              id="team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          {availableUsers.length > 0 && (
            <div className="space-y-2">
              <Label>Membres</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`member-${user.id}`}
                      checked={selectedMemberIds.includes(user.id)}
                      onChange={() => handleMemberToggle(user.id)}
                      className="rounded"
                    />
                    <label
                      htmlFor={`member-${user.id}`}
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {user.name}
                    </label>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full cursor-pointer">
            {team ? "Enregistrer" : "Créer une équipe"}
          </Button>
        </CardFooter>
      </div>
    </form>
  );
}
