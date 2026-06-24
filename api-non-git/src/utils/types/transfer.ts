import {ApiProperty, IntersectionType, OmitType, PickType} from "@nestjs/swagger";
import {GeometryPoint} from "../../generated/prisma-class/geometry_point";
import {GeometryPointRelations} from "../../generated/prisma-class/geometry_point_relations";
import {Geometry} from "../../generated/prisma-class/geometry";
import {Project} from "../../generated/prisma-class/project";
import {SafetyEquipmentType} from "../../generated/prisma-class/safety_equipment_type";
import {Team} from "../../generated/prisma-class/team";
import {SafetyEquipmentTypeLength} from "../../generated/prisma-class/safety_equipment_type_length";
import {SafetyEquipmentTypeLengthRelations} from "../../generated/prisma-class/safety_equipment_type_length_relations";
import {Action} from "../../generated/prisma-class/action";
import {SafetyEquipment} from "../../generated/prisma-class/safety_equipment";
import {SafetyEquipmentPoint} from "../../generated/prisma-class/safety_equipment_point";
import {SafetyEquipmentPointRelations} from "../../generated/prisma-class/safety_equipment_point_relations";

export class GeometryPoints {
    @ApiProperty({isArray: true, type: () => IntersectionType(GeometryPoint, PickType(GeometryPointRelations, ['point']))})
    geometryPoints: (GeometryPoint&Pick<GeometryPointRelations, 'point'>)[];
}

export class Geometries {
    @ApiProperty({isArray: true, type: () => IntersectionType(Geometry, GeometryPoints)})
    geometries: (Geometry&GeometryPoints)[];
}

export class ProjectDetailsAndSafetyEquipmentTypes {
    @ApiProperty({type: () => IntersectionType(Project, Geometries)})
    details: Project&Geometries;

    @ApiProperty({isArray: true, type: () => SafetyEquipmentType})
    safetyEquipmentTypes: SafetyEquipmentType;
}

export class ProjectAndTeams {
    @ApiProperty({isArray: true, type: () => OmitType(Team, ['projectId', 'createdAt', 'updatedAt']), required: false})
    teams?: Pick<Team, 'id' | 'name'>[];

    @ApiProperty({type: () => ProjectDetailsAndSafetyEquipmentTypes, required: false})
    project?: ProjectDetailsAndSafetyEquipmentTypes;
}

export class ActionsAndSafetyEquipmentTypeLength extends SafetyEquipment {
    @ApiProperty({isArray: true, type: () => Action})
    actions: Action[];

    @ApiProperty({type: () => IntersectionType(SafetyEquipmentTypeLength, PickType(SafetyEquipmentTypeLengthRelations, ['safetyEquipmentType']))})
    safetyEquipmentTypeLength: SafetyEquipmentTypeLength&Pick<SafetyEquipmentTypeLengthRelations, 'safetyEquipmentType'>;

    @ApiProperty({isArray: true, type: () => IntersectionType(SafetyEquipmentPoint, PickType(SafetyEquipmentPointRelations, ['point']))})
    safetyEquipmentPoints: (SafetyEquipmentPoint&Pick<SafetyEquipmentPointRelations, 'point'>)[];
}

export class SafetyEquipments {
    @ApiProperty({isArray: true, type: () => ActionsAndSafetyEquipmentTypeLength})
    safetyEquipments: ActionsAndSafetyEquipmentTypeLength[];
}
