import NavBar from "@/components/NavBar";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/_auth/")({
  beforeLoad: () => redirect({ to: "/login" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Hello go to login</h1>
      <Link to="/login">Login</Link>
    </>
  );
}
