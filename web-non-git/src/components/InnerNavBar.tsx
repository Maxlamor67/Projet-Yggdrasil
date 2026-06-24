import {
  HouseIcon,
  InboxIcon,
  MapIcon,
  SearchIcon,
  WifiSyncIcon,
  ZapIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouterState } from "@tanstack/react-router";

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/editor/$projectId/map", icon: MapIcon, label: "Map" },
  {
    href: "/editor/$projectId/app-connect",
    icon: WifiSyncIcon,
    label: "Sync avec le mobile",
  },
];

export default function InnerNavBar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-center">
        {/* Menu centré */}
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {/* Lien Map */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/editor/$projectId/map"
                active={pathname === "/editor/$projectId/map"}
                className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
              >
                <MapIcon
                  aria-hidden="true"
                  className="text-muted-foreground/80"
                  size={16}
                />
                <span>Map</span>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Lien Sync */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/editor/$projectId/app-connect"
                active={pathname === "/editor/$projectId/app-connect"}
                className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
              >
                <WifiSyncIcon
                  aria-hidden="true"
                  className="text-muted-foreground/80"
                  size={16}
                />
                <span>Sync avec le mobile</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
