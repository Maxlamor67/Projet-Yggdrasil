import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { type FormEvent, useState } from "react";

export type UserFormData = {
  name: string;
  email: string;
  phone?: string;
};

type UserFormProps = {
  mode: "create" | "edit";
  initialState: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
};

export default function UserForm({
  mode,
  initialState,
  onSubmit,
}: UserFormProps) {
  const [name, setName] = useState(initialState?.name || "");
  const [email, setEmail] = useState(initialState?.email || "");
  const [phone, setPhone] = useState(initialState?.phone || "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit({
      name,
      email,
      phone: phone || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardContent className="space-y-4">
        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            placeholder="john@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Téléphone (optionnel) */}
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone (optionnel)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button type="submit" className="w-full">
          {mode === "create" ? "Créer" : "Enregistrer"}
        </Button>
      </CardFooter>
    </form>
  );
}
