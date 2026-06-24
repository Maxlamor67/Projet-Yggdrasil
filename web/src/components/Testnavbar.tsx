import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const NAVBAR_LINKS = {
  default: [
    { href: "/mainPage", label: "Éditeur" },
    { href: "/projectsList", label: "Gestion des projets" },
    { href: "/peopleList", label: "Gestion du personnel" },
  ],
  admin: [
    { href: "/admin", label: "Administration" },
    { href: "/users", label: "Utilisateurs" },
  ],
};

function Testnavbar({ mode = "default" }) {
  const links =
    NAVBAR_LINKS[mode as keyof typeof NAVBAR_LINKS] ?? NAVBAR_LINKS.default;
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.href}>
              <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href={link.href}>
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

export default Testnavbar;
