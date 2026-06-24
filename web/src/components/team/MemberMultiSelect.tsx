import { useState } from "react"

interface User {
    id: string;
    name: string;
}
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {useQuery} from "@tanstack/react-query";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import {authClient} from "@/lib/auth-client.ts";

interface MemberMultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function MemberMultiSelect({ value, onChange }: MemberMultiSelectProps) {
    const [open, setOpen] = useState(false);

    const getUsersQuery = useQueryWithErrorHandling(
        useQuery({
            queryKey: ["getUsers"],
            queryFn: async () =>
                await authClient.admin.listUsers({
                    query: {
                        sortBy: "name",
                        sortDirection: "desc",
                        filterField: "role",
                        filterValue: "user",
                        filterOperator: "eq",
                    },
                }),
            retry: 0,
        }),
        "GetUsers",
        "Impossible de charger les utilisateurs"
    );

    const handleSelect = (memberId: string) => {
        const newValue = value.includes(memberId)
            ? value.filter(id => id !== memberId)
            : [...value, memberId];
        onChange(newValue);
    };

    if (getUsersQuery.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value.length === 0
                        ? "Sélectionner des membres..."
                        : `${value.length} membre(s) sélectionné(s)`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Rechercher un membre..." />
                    <CommandEmpty>Aucun membre trouvé.</CommandEmpty>
                    <CommandGroup>
                        {getUsersQuery.data?.data?.users.map((membre: User) => (
                            <CommandItem
                                key={membre.id}
                                onSelect={() => handleSelect(membre.id)}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value.includes(membre.id) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {membre.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

