import NavBar from "@/components/NavBar";
import { createFileRoute } from "@tanstack/react-router";
import { Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  context: () => ({
    navbarMode: "default",
  }),
  component: AuthLayout,
});

function AuthLayout() {
  return (
      <div className="relative h-screen flex flex-col">
        <div className="relative z-50">
          <NavBar />
        </div>
        <div className="relative z-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
  );
}
