import type {Action, SafetyEquipment, SafetyEquipmentType} from "@/types/temp.ts";

export interface TimelineStep {
    datetime: Date;
    actions: {
        action: Action;
        safetyEquipment: SafetyEquipment;
        safetyEquipmentType: SafetyEquipmentType;
    }[];
}