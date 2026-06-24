import { Project } from './project';
import { SafetyEquipmentTypeLength } from './safety_equipment_type_length';
import { Action } from './action';
import { SafetyEquipmentPoint } from './safety_equipment_point';
export declare class SafetyEquipmentRelations {
    project: Project;
    safetyEquipmentTypeLength: SafetyEquipmentTypeLength;
    actions: Action[];
    safetyEquipmentPoints: SafetyEquipmentPoint[];
}
