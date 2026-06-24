// timelineUtils.ts - Fonctions utilitaires pour la Timeline

import type { Action, SafetyEquipment, SafetyEquipmentType } from "@/types/temp.ts";
import { mockSafetyEquipmentTypeLengths } from "./timelineData";
import type {TimelineStep} from "@/types/timeline.ts";

/**
 * Génère les steps de la timeline à partir de la liste des actions
 * Chaque step regroupe toutes les actions qui se passent au même instant
 */
export function generateTimelineSteps(
  actions: Action[],
  safetyEquipments: SafetyEquipment[],
  safetyEquipmentTypes: SafetyEquipmentType[]
): TimelineStep[] {
  // Trier toutes les actions par date chronologique
  const sortedActions = [...actions].sort((a, b) => {
    return new Date(a.realizedAt).getTime() - new Date(b.realizedAt).getTime();
  });

  // Grouper les actions par instant (même datetime)
  const groupedByDatetime: Record<string, TimelineStep["actions"]> = {};

  sortedActions.forEach((action) => {
    const key = new Date(action.realizedAt).toISOString();
    if (!groupedByDatetime[key]) {
      groupedByDatetime[key] = [];
    }

    // Trouver le safetyEquipment correspondant
    const safetyEquipment = safetyEquipments.find(se => se.id === action.safetyEquipmentId);
    if (!safetyEquipment) return;

    // Trouver le type de l'équipement
    const typeLength = mockSafetyEquipmentTypeLengths.find(
      tl => tl.id === safetyEquipment.safetyEquipmentTypeLengthId
    );
    const safetyEquipmentType = safetyEquipmentTypes.find(
      t => t.id === typeLength?.safetyEquipmentTypeId
    );
    if (!safetyEquipmentType) return;

    groupedByDatetime[key].push({
      action,
      safetyEquipment,
      safetyEquipmentType,
    });
  });

  // Transformer en array de TimelineStep, triés chronologiquement
  const steps: TimelineStep[] = Object.entries(groupedByDatetime)
    .map(([datetime, actions]) => ({
      datetime: new Date(datetime),
      actions,
    }))
    .sort((a, b) => {
      return a.datetime.getTime() - b.datetime.getTime();
    });

  return steps;
}

/**
 * Calcule quels équipements sont actifs à un instant T donné
 * Un équipement est actif s'il a une action SET avant T et pas d'action UNSET avant T
 */
export function getActiveSafetyEquipments(
  currentDatetime: Date,
  actions: Action[],
  safetyEquipments: SafetyEquipment[]
): SafetyEquipment[] {
  const currentTime = currentDatetime.getTime();

  return safetyEquipments.filter((equipment) => {
    const equipmentActions = actions
      .filter(a => a.safetyEquipmentId === equipment.id)
      .filter(a => new Date(a.realizedAt).getTime() <= currentTime)
      .sort((a, b) => new Date(b.realizedAt).getTime() - new Date(a.realizedAt).getTime());

    // Le dernier état de l'équipement avant currentTime
    const lastAction = equipmentActions[0];
    return lastAction?.type === "SET";
  });
}

/**
 * Détermine la couleur du point sur la timeline selon les types d'actions
 * - Vert : que des mises en place (SET)
 * - Rouge : que des retraits (UNSET)
 * - Orange : mix des deux
 */
export function getStepColor(
  actions: Action[]
): "green" | "red" | "orange" {
  const hasSet = actions.some((a) => a.type === "SET");
  const hasUnset = actions.some((a) => a.type === "UNSET");

  if (hasSet && hasUnset) {
    return "orange";
  }

  return hasSet ? "green" : "red";
}

/**
 * Formate une date en format lisible : "10/10/2025 - 08:00"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

/**
 * Formate une date en format court pour les extrémités : "10/10 08:00"
 */
export function formatDateTimeShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month} ${hours}:${minutes}`;
}
