import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Member, type Team, fetchMembers } from "./mockmembers";
import { Link } from "@tanstack/react-router";

type CreateTeamDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamCreated: (team: Team) => void;
};

export function CreateTeamDialog({
  open,
  onOpenChange,
  onTeamCreated,
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("");
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Charger les membres au montage du dialog
  useEffect(() => {
    if (open) {
      setIsLoadingMembers(true);
      fetchMembers().then((members) => {
        setAvailableMembers(members);
        setIsLoadingMembers(false);
      });
    }
  }, [open]);

  const handleSelectMember = (member: Member) => {
    if (!selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setSearchValue("");
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) return;

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: teamName,
      members: selectedMembers,
      createdAt: new Date(),
    };

    onTeamCreated(newTeam);

    // Reset le formulaire
    setTeamName("");
    setSelectedMembers([]);
    setSearchValue("");
    onOpenChange(false);
  };

  const filteredMembers = availableMembers.filter(
    (member) =>
      !selectedMembers.find((m) => m.id === member.id) &&
      (member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.email.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle équipe</DialogTitle>
          <DialogDescription>
            Ajoutez un nom et des membres à votre équipe.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Nom de l'équipe */}
          <div className="grid gap-2">
            <Label htmlFor="team-name">
              Nom de l'équipe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="team-name"
              placeholder="Ex: Équipe Installation Nord"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          {/* Sélection des membres */}
          <div className="grid gap-2">
            <Label>Membres de l'équipe</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="justify-between"
                  disabled={isLoadingMembers}
                >
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    {isLoadingMembers
                      ? "Chargement..."
                      : "Rechercher des membres..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Rechercher un membre..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>Aucun membre trouvé.</CommandEmpty>
                    <CommandGroup>
                      {filteredMembers.map((member) => (
                        <CommandItem
                          key={member.id}
                          value={member.id}
                          onSelect={() => {
                            handleSelectMember(member);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedMembers.find((m) => m.id === member.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {member.email}
                              {member.role && ` • ${member.role}`}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Liste des membres sélectionnés */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50">
                {selectedMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant="secondary"
                    className="pl-3 pr-1 py-1"
                  >
                    <span className="mr-1">{member.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              💡 Pour créer des membres, aller à{" "}
              <Link to="/dashboard/people" className="underline">
                "Page Membres"
              </Link>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setTeamName("");
              setSelectedMembers([]);
              onOpenChange(false);
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleCreateTeam} disabled={!teamName.trim()}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
