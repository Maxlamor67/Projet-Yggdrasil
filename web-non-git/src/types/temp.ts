import type {GetAllPointsToSecureResponse as InterestPoint, Project, Team} from "@/api";

// FICHIER TEMPORAIRE

export interface SafetyEquipment {
    id: string;
    projectId: string;
    safetyEquipmentTypeLengthId: string;
    safetyEquipmentTypeLengthCount: number;
    createdAt: Date;
    updatedAt: Date;

    project?: Project;
    safetyEquipmentTypeLength?: SafetyEquipmentTypeLength;
    actions?: Action[];
    safetyEquipmentPoints?: SafetyEquipmentPoint[];
}

export interface SafetyEquipmentPoint {
    id: string;
    safetyEquipmentId: string;
    pointId: string;
    rank: number;
    createdAt: Date;
    updatedAt: Date;

    safetyEquipment?: SafetyEquipment;
    point?: Point;
}

export type SafetyEquipmentTypeModel = "VEHICLE" | "OBSTACLE";

export interface SafetyEquipmentType {
    id: string;
    name: string;
    model: SafetyEquipmentTypeModel;
    createdAt: Date;

    pointsToSecure?: InterestPoint[];
    lengths?: SafetyEquipmentTypeLength[];
}

export interface SafetyEquipmentTypeLength {
    id: string;
    safetyEquipmentTypeId: string;
    length: number;
    createdAt: Date;

    safetyEquipmentType?: SafetyEquipmentType;
    safetyEquipments?: SafetyEquipment[];
}

export type ActionType = "SET" | "UNSET";

export interface Action {
    id: string;
    safetyEquipmentId: string;
    teamId: string | null;
    type: ActionType;
    realizedAt: Date;
    createdAt: Date;
    updatedAt: Date;

    safetyEquipment?: SafetyEquipment;
    team?: Team;
}

export type PointType = "GEOMETRY" | "SAFETY_EQUIPMENT" | "POINT_TO_SECURE" | "ATTENTION_POINT";

export interface Point {
    id: string;
    type: PointType;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;

    safetyEquipmentPoint?: SafetyEquipmentPoint;
}








