import type { Employe } from "./employe";
import { mockEmployes } from "./employe";

export type Equipe = {
  id: string;
  name: string;
  eventId: string;
  employes: Employe[];
};

/* ───────────── Mock data ───────────── */

export const mockEquipes: Equipe[] = [
  {
    id: "team-1",
    name: "Équipe Alpha",
    eventId: "event-2025-01",
    employes: [mockEmployes[0], mockEmployes[1]],
  },
  {
    id: "team-2",
    name: "Équipe Bravo",
    eventId: "event-2025-01",
    employes: [mockEmployes[2]],
  },
];
