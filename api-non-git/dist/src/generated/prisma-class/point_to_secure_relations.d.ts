import { Project } from './project';
import { Photo } from './photo';
import { SafetyEquipmentType } from './safety_equipment_type';
import { Point } from './point';
export declare class PointToSecureRelations {
    project: Project;
    photos: Photo[];
    safetyEquipmentType?: SafetyEquipmentType;
    point: Point;
}
