import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueryWithErrorHandling } from "@/hooks/useQueryWithErrorHandling";
import { Label } from "@/components/ui/label";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client.ts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api.ts";
import { z } from "zod";

const fallback = "/dashboard/projects" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const isAnyAdminQuery = useQueryWithErrorHandling(
    useQuery({
      queryKey: ["isAnyAdmin"],
      queryFn: async () => await api.user.userControllerFindOneAdminV2(),
      retry: 0,
    }),
    "IsAnyAdmin",
    "Erreur lors de la vérification des administrateurs"
  );

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const search = Route.useSearch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
      return;
    }

    router.navigate({ to: "/dashboard/projects" });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      email,
      name: fullname,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
      return;
    }

    router.navigate({ to: search.redirect || fallback });
  };

  if (isAnyAdminQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isAnyAdminQuery.data?.data.id ? (
        /* --- LOGIN --- */
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Entrez vos informations pour accéder à votre compte.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-login">Mot de passe</Label>
                <Input
                  id="password-login"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        /* --- SIGNUP --- */
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Inscription</CardTitle>
            <CardDescription>
              Créez un nouveau compte en quelques secondes.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup">Nom</Label>
                <Input
                  id="name-signup"
                  type="text"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-signup">Mot de passe</Label>
                <Input
                  id="password-signup"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer un compte"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
