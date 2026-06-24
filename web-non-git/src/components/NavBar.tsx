import InfoMenu from "@/components/navbar-components/info-menu";
import Logo from "@/components/navbar-components/logo";
import NotificationMenu from "@/components/navbar-components/notification-menu";
import UserMenu from "@/components/navbar-components/user-menu";
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
import {
  useMatches,
  useMatchRoute,
  useParams,
  useRouteContext,
} from "@tanstack/react-router";

// Navigation links array to be used in both desktop and mobile menus
/* TODO: 
- Modifier UserMenu options etc. 
- ✅ Replace with own navigation links 
*/

const NAVBAR_LINKS = {
  default: [
    { href: "/dashboard/projects", label: "Gestion des projets" },
    { href: "/dashboard/people", label: "Gestion du personnel" },
    { href: "/dashboard/equipments", label: "Gestion des types d'équipements" },
  ],
  editor: [
    { href: "/editor/$projectId/map", label: "Map Editor" },
    { href: "/editor/$projectId/app-connect", label: "Synchroniser le Mobile" },
  ],
};

export default function NavBar() {
  const matchRoute = useMatchRoute();
  const matches = useMatches();

  // TODO: Feature avoir une
  // Trouver navbarMode depuis les routes actives
  const navbarMode =
    [...matches].reverse().find((m) => m.context?.navbarMode)?.context
      ?.navbarMode ?? "default";

  // Récupération des liens
  const baseLinks =
    NAVBAR_LINKS[navbarMode as keyof typeof NAVBAR_LINKS] ??
    NAVBAR_LINKS.default;

  // --- Transformer dynamiquement les URLs ---
  const navigationLinks = NAVBAR_LINKS.default.map((link) => {
    /*  if (projectId) {
      return {
        ...link,
        href: link.href.replace("$projectId", projectId),
      };
    } */
    return link;
  });

  return (
    <header className="border-b px-4 md:px-6 bg-background">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                size="icon"
                variant="ghost"
              >
                <svg
                  className="pointer-events-none"
                  fill="none"
                  height={16}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width={16}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    d="M4 12L20 12"
                  />
                  <path
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    d="M4 12H20"
                  />
                  <path
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    d="M4 12H20"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const isActive = !!matchRoute({ to: link.href });
                    return (
                      <NavigationMenuItem className="w-full" key={link.href}>
                        <NavigationMenuLink
                          active={isActive}
                          className="py-1.5"
                          href={link.href}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a className="text-primary hover:text-primary/90" href="/">
              <Logo />
            </a>
            {/* Navigation menu */}
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, _index) => {
                  const isActive = !!matchRoute({ to: link.href });
                  return (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuLink
                        active={isActive}
                        className="py-1.5 font-medium text-muted-foreground hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
