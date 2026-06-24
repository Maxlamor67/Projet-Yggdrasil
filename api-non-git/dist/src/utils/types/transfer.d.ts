import { GeometryPoint } from "../../generated/prisma-class/geometry_point";
import { GeometryPointRelations } from "../../generated/prisma-class/geometry_point_relations";
import { Geometry } from "../../generated/prisma-class/geometry";
import { Project } from "../../generated/prisma-class/project";
import { SafetyEquipmentType } from "../../generated/prisma-class/safety_equipment_type";
import { Team } from "../../generated/prisma-class/team";
import { SafetyEquipmentTypeLength } from "../../generated/prisma-class/safety_equipment_type_length";
import { SafetyEquipmentTypeLengthRelations } from "../../generated/prisma-class/safety_equipment_type_length_relations";
import { Action } from "../../generated/prisma-class/action";
import { SafetyEquipment } from "../../generated/prisma-class/safety_equipment";
import { SafetyEquipmentPoint } from "../../generated/prisma-class/safety_equipment_point";
import { SafetyEquipmentPointRelations } from "../../generated/prisma-class/safety_equipment_point_relations";
export declare class GeometryPoints {
    geometryPoints: (GeometryPoint & Pick<GeometryPointRelations, 'point'>)[];
}
export declare class Geometries {
    geometries: (Geometry & GeometryPoints)[];
}
export declare class ProjectDetailsAndSafetyEquipmentTypes {
    details: Project & Geometries;
    safetyEquipmentTypes: SafetyEquipmentType;
}
export declare class ProjectAndTeams {
    teams?: Pick<Team, 'id' | 'name'>[];
    project?: ProjectDetailsAndSafetyEquipmentTypes;
}
export declare class ActionsAndSafetyEquipmentTypeLength extends SafetyEquipment {
    actions: Action[];
    safetyEquipmentTypeLength: SafetyEquipmentTypeLength & Pick<SafetyEquipmentTypeLengthRelations, 'safetyEquipmentType'>;
    safetyEquipmentPoints: (SafetyEquipmentPoint & Pick<SafetyEquipmentPointRelations, 'point'>)[];
}
export declare class SafetyEquipments {
    safetyEquipments: ActionsAndSafetyEquipmentTypeLength[];
}
