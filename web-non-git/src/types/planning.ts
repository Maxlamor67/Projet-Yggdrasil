import type { Equipe } from "./equipe";

export type PlanningActionType = "installation" | "retrait";

export type PlanningAction = {
  id: string;
  date: string;
  time: string;
  action: string;
  equipmentName: string;
  length: number | null;
  quantity: number;
  latitude: number;
  longitude: number;
};

export type ItineraryPoint = {
  latitude: number;
  longitude: number;
};

export type Planning = {
  id: string;
  equipe: Equipe;
  actions: PlanningAction[];
  itinerary: ItineraryPoint[];
};
