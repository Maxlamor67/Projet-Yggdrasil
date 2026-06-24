import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { AuthContext } from "@/providers/auth.tsx";
import type { NavbarMode } from "@/types/navbarmode";

interface RouterContexts {
  auth: AuthContext;
  navbarMode?: NavbarMode;
}

export const Route = createRootRouteWithContext<RouterContexts>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
