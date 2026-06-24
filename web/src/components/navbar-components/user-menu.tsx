import {
  BoltIcon,
  BookOpenIcon,
  Layers2Icon,
  LogOutIcon,
  PinIcon,
  UserIcon,
  UserPenIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client.ts";
import { useAuth } from "@/providers/auth.tsx";

export default function UserMenu() {
  const { user } = useAuth();

  const handleLogout = async () => {
    const signOut = await authClient.signOut();

    if (signOut.data?.success) {
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto p-0 hover:bg-transparent cursor-pointer" variant="ghost">
          <UserIcon aria-hidden="true" className="opacity-60" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            {user?.name}
          </span>
          <span className="truncate font-normal text-muted-foreground text-xs">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button className='cursor-pointer' onClick={handleLogout}>
            <LogOutIcon aria-hidden="true" className="opacity-60" size={16} />
            Se déconnecter
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
