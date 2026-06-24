import type { SafetyEquipment, SafetyEquipmentType, SafetyEquipmentTypeLength, Action, SafetyEquipmentPoint, Point } from "@/types/temp.ts";

// FICHIER TEMPORAIRE

export const mockSafetyEquipmentTypes: SafetyEquipmentType[] = [
  {
    id: "set1",
    name: "Glissière béton armé (GBA)",
    model: "OBSTACLE",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "set2",
    name: "Bloc de béton",
    model: "OBSTACLE",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "set3",
    name: "Barrière Vauban",
    model: "OBSTACLE",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "set4",
    name: "Barrière Héras",
    model: "OBSTACLE",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "set5",
    name: "Obstacle",
    model: "OBSTACLE",
    createdAt: new Date("2025-01-01"),
  },
  {
    id: "set6",
    name: "Engin de blocage",
    model: "VEHICLE",
    createdAt: new Date("2025-01-01"),
  },
];

export const mockSafetyEquipmentTypeLengths: SafetyEquipmentTypeLength[] = [
  // GBA
  { id: "setl1", safetyEquipmentTypeId: "set1", length: 2.0, createdAt: new Date("2025-01-01") },
  { id: "setl2", safetyEquipmentTypeId: "set1", length: 1.0, createdAt: new Date("2025-01-01") },
  // Bloc de béton
  { id: "setl3", safetyEquipmentTypeId: "set2", length: 1.0, createdAt: new Date("2025-01-01") },
  { id: "setl4", safetyEquipmentTypeId: "set2", length: 2.5, createdAt: new Date("2025-01-01") },
  // Barrière Vauban
  { id: "setl5", safetyEquipmentTypeId: "set3", length: 2.0, createdAt: new Date("2025-01-01") },
  // Barrière Héras
  { id: "setl6", safetyEquipmentTypeId: "set4", length: 3.5, createdAt: new Date("2025-01-01") },
  // Obstacle
  { id: "setl7", safetyEquipmentTypeId: "set5", length: 0.95, createdAt: new Date("2025-01-01") },
  { id: "setl8", safetyEquipmentTypeId: "set5", length: 1.05, createdAt: new Date("2025-01-01") },
  // Engin de blocage
  { id: "setl9", safetyEquipmentTypeId: "set6", length: 8.0, createdAt: new Date("2025-01-01") },
  { id: "setl10", safetyEquipmentTypeId: "set6", length: 9.35, createdAt: new Date("2025-01-01") },
  { id: "setl11", safetyEquipmentTypeId: "set6", length: 9.5, createdAt: new Date("2025-01-01") },
  { id: "setl12", safetyEquipmentTypeId: "set6", length: 11.0, createdAt: new Date("2025-01-01") },
  { id: "setl13", safetyEquipmentTypeId: "set6", length: 16.0, createdAt: new Date("2025-01-01") },
];


export const mockPoints: Point[] = [
  // Points pour se1 (Cathédrale)
  { id: "p1", type: "SAFETY_EQUIPMENT", latitude: 48.5818, longitude: 7.7507, createdAt: new Date(), updatedAt: new Date() },
  { id: "p2", type: "SAFETY_EQUIPMENT", latitude: 48.5822, longitude: 7.7512, createdAt: new Date(), updatedAt: new Date() },
  // Points pour se2 (Place Kléber)
  { id: "p3", type: "SAFETY_EQUIPMENT", latitude: 48.5839, longitude: 7.7455, createdAt: new Date(), updatedAt: new Date() },
  { id: "p4", type: "SAFETY_EQUIPMENT", latitude: 48.5843, longitude: 7.7462, createdAt: new Date(), updatedAt: new Date() },
  { id: "p5", type: "SAFETY_EQUIPMENT", latitude: 48.5847, longitude: 7.7468, createdAt: new Date(), updatedAt: new Date() },
  // Points pour se3 (Petite France)
  { id: "p6", type: "SAFETY_EQUIPMENT", latitude: 48.5801, longitude: 7.7410, createdAt: new Date(), updatedAt: new Date() },
  // Points pour se4 (Parc de l'Orangerie)
  { id: "p7", type: "SAFETY_EQUIPMENT", latitude: 48.5912, longitude: 7.7723, createdAt: new Date(), updatedAt: new Date() },
  { id: "p8", type: "SAFETY_EQUIPMENT", latitude: 48.5918, longitude: 7.7735, createdAt: new Date(), updatedAt: new Date() },
  // Points pour se5 (Quartier Européen)
  { id: "p9", type: "SAFETY_EQUIPMENT", latitude: 48.5965, longitude: 7.7695, createdAt: new Date(), updatedAt: new Date() },
  { id: "p10", type: "SAFETY_EQUIPMENT", latitude: 48.5970, longitude: 7.7702, createdAt: new Date(), updatedAt: new Date() },
  // Points pour se6 (Gare centrale)
  { id: "p11", type: "SAFETY_EQUIPMENT", latitude: 48.5851, longitude: 7.7346, createdAt: new Date(), updatedAt: new Date() },
  { id: "p12", type: "SAFETY_EQUIPMENT", latitude: 48.5855, longitude: 7.7352, createdAt: new Date(), updatedAt: new Date() },
  { id: "p13", type: "SAFETY_EQUIPMENT", latitude: 48.5859, longitude: 7.7358, createdAt: new Date(), updatedAt: new Date() },
];

export const mockSafetyEquipmentPoints: SafetyEquipmentPoint[] = [
  { id: "sep1", safetyEquipmentId: "se1", pointId: "p1", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[0] },
  { id: "sep2", safetyEquipmentId: "se1", pointId: "p2", rank: 1, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[1] },
  { id: "sep3", safetyEquipmentId: "se2", pointId: "p3", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[2] },
  { id: "sep4", safetyEquipmentId: "se2", pointId: "p4", rank: 1, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[3] },
  { id: "sep5", safetyEquipmentId: "se2", pointId: "p5", rank: 2, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[4] },
  { id: "sep6", safetyEquipmentId: "se3", pointId: "p6", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[5] },
  { id: "sep7", safetyEquipmentId: "se4", pointId: "p7", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[6] },
  { id: "sep8", safetyEquipmentId: "se4", pointId: "p8", rank: 1, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[7] },
  { id: "sep9", safetyEquipmentId: "se5", pointId: "p9", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[8] },
  { id: "sep10", safetyEquipmentId: "se5", pointId: "p10", rank: 1, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[9] },
  { id: "sep11", safetyEquipmentId: "se6", pointId: "p11", rank: 0, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[10] },
  { id: "sep12", safetyEquipmentId: "se6", pointId: "p12", rank: 1, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[11] },
  { id: "sep13", safetyEquipmentId: "se6", pointId: "p13", rank: 2, createdAt: new Date(), updatedAt: new Date(), point: mockPoints[12] },
];

// Créer les SafetyEquipmentTypeLengths avec leur type parent
const mockSafetyEquipmentTypeLengthsWithType: SafetyEquipmentTypeLength[] = [
  {
    id: "setl1",
    safetyEquipmentTypeId: "set1",
    length: 2.0,
    createdAt: new Date("2025-01-01"),
    safetyEquipmentType: mockSafetyEquipmentTypes[0] // Bloc béton - OBSTACLE
  },
  {
    id: "setl2",
    safetyEquipmentTypeId: "set2",
    length: 3.5,
    createdAt: new Date("2025-01-01"),
    safetyEquipmentType: mockSafetyEquipmentTypes[1] // Barrière Vauban - OBSTACLE
  },
  {
    id: "setl3",
    safetyEquipmentTypeId: "set3",
    length: 5.0,
    createdAt: new Date("2025-01-01"),
    safetyEquipmentType: mockSafetyEquipmentTypes[2] // Véhicule sécurité - VEHICLE
  },
];

export const mockSafetyEquipments: SafetyEquipment[] = [
  {
    id: "se1",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl1",
    safetyEquipmentTypeLengthCount: 12,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se1"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[0],
  },
  {
    id: "se2",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl2",
    safetyEquipmentTypeLengthCount: 8,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se2"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[1],
  },
  {
    id: "se3",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl3",
    safetyEquipmentTypeLengthCount: 1,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se3"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[2],
  },
  {
    id: "se4",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl1",
    safetyEquipmentTypeLengthCount: 6,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se4"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[0],
  },
  {
    id: "se5",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl2",
    safetyEquipmentTypeLengthCount: 4,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se5"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[1],
  },
  {
    id: "se6",
    projectId: "proj1",
    safetyEquipmentTypeLengthId: "setl2",
    safetyEquipmentTypeLengthCount: 6,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-01"),
    safetyEquipmentPoints: mockSafetyEquipmentPoints.filter(sep => sep.safetyEquipmentId === "se6"),
    safetyEquipmentTypeLength: mockSafetyEquipmentTypeLengthsWithType[1],
  },
];


export const mockActions: Action[] = [
  { id: "a1", safetyEquipmentId: "se1", teamId: "team1", type: "SET", realizedAt: new Date("2025-10-10T08:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a2", safetyEquipmentId: "se1", teamId: "team1", type: "UNSET", realizedAt: new Date("2025-10-10T18:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a3", safetyEquipmentId: "se2", teamId: "team2", type: "SET", realizedAt: new Date("2025-10-10T09:30:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a4", safetyEquipmentId: "se2", teamId: "team2", type: "UNSET", realizedAt: new Date("2025-10-10T20:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a5", safetyEquipmentId: "se3", teamId: null, type: "SET", realizedAt: new Date("2025-10-10T09:30:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a6", safetyEquipmentId: "se3", teamId: null, type: "UNSET", realizedAt: new Date("2025-10-10T17:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a7", safetyEquipmentId: "se4", teamId: "team1", type: "SET", realizedAt: new Date("2025-10-10T12:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a8", safetyEquipmentId: "se4", teamId: "team1", type: "UNSET", realizedAt: new Date("2025-10-10T17:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a9", safetyEquipmentId: "se5", teamId: "team2", type: "SET", realizedAt: new Date("2025-10-10T14:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a10", safetyEquipmentId: "se5", teamId: "team2", type: "UNSET", realizedAt: new Date("2025-10-10T22:00:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a11", safetyEquipmentId: "se6", teamId: "team2", type: "SET", realizedAt: new Date("2025-10-10T16:21:00"), createdAt: new Date(), updatedAt: new Date() },
  { id: "a12", safetyEquipmentId: "se6", teamId: "team2", type: "UNSET", realizedAt: new Date("2025-10-10T17:02:00"), createdAt: new Date(), updatedAt: new Date() },
];
