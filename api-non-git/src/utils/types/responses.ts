import {AttentionPoint} from "../../generated/prisma-class/attention_point";
import {Geometry} from "../../generated/prisma-class/geometry";
import {ApiProperty, IntersectionType, OmitType, PartialType, PickType} from "@nestjs/swagger";
import {AttentionPointRelations} from "../../generated/prisma-class/attention_point_relations";
import {GeometryRelations} from "../../generated/prisma-class/geometry_relations";
import {GeometryPoint} from "../../generated/prisma-class/geometry_point";
import {GeometryPointRelations} from "../../generated/prisma-class/geometry_point_relations";
import {SafetyEquipment} from "../../generated/prisma-class/safety_equipment";
import {SafetyEquipmentRelations} from "../../generated/prisma-class/safety_equipment_relations";
import {SafetyEquipmentTypeLength} from "../../generated/prisma-class/safety_equipment_type_length";
import {SafetyEquipmentPoint} from "../../generated/prisma-class/safety_equipment_point";
import {Photo} from "../../generated/prisma-class/photo";
import {Team} from "../../generated/prisma-class/team";
import {TeamRelations} from "../../generated/prisma-class/team_relations";
import {User} from "../../generated/prisma-class/user";
import {SafetyEquipmentPointRelations} from "../../generated/prisma-class/safety_equipment_point_relations";
import {SafetyEquipmentTypeLengthRelations} from "../../generated/prisma-class/safety_equipment_type_length_relations";
import {Transfer} from "../../generated/prisma-class/transfer";
import {ProjectAndTeams, SafetyEquipments} from "./transfer";
import {Project} from "../../generated/prisma-class/project";
import {PointToSecure} from "../../generated/prisma-class/point_to_secure";
import {PointToSecureRelations} from "../../generated/prisma-class/point_to_secure_relations";
import {SafetyEquipmentType} from "../../generated/prisma-class/safety_equipment_type";
import {SafetyEquipmentTypeRelations} from "../../generated/prisma-class/safety_equipment_type_relations";
import {Action} from "../../generated/prisma-class/action";
import {ActionRelations} from "../../generated/prisma-class/action_relations";

export class GetAttentionPointsResponse extends IntersectionType(AttentionPoint, PickType(AttentionPointRelations, ['point'])) {}

export class GetGeometryResponse extends IntersectionType(Geometry, PickType(GeometryRelations, ['route'])) {
    @ApiProperty({ isArray: true, type: () => IntersectionType(GeometryPoint, PickType(GeometryPointRelations, ['point'])) })
    geometryPoints: (GeometryPoint&Pick<GeometryPointRelations, 'point'>)[];
}

export class GetSafetyEquipmentResponse extends SafetyEquipment {
    @ApiProperty({ type: () => IntersectionType(SafetyEquipmentTypeLength, PickType(SafetyEquipmentTypeLengthRelations, ['safetyEquipmentType'])) })
    safetyEquipmentTypeLength: SafetyEquipmentTypeLength&Pick<SafetyEquipmentTypeLengthRelations, 'safetyEquipmentType'>;

    @ApiProperty({ isArray: true, type: () => IntersectionType(SafetyEquipmentPoint, PickType(SafetyEquipmentPointRelations, ['point'])) })
    safetyEquipmentPoints: (SafetyEquipmentPoint&Pick<SafetyEquipmentPointRelations, 'point'>)[];

    @ApiProperty({ isArray: true, type: () => IntersectionType(Action, PickType(ActionRelations, ['team'])) })
    actions: (Action&Pick<ActionRelations, 'team'>)[];
}

export class GetAllSafetyEquipmentsResponse extends GetSafetyEquipmentResponse {}

export class GetPointToSecureResponse extends IntersectionType(PointToSecure, OmitType(PointToSecureRelations, ['project', 'photos'])) {
    @ApiProperty({ isArray: true, type: () => PickType(Photo, ['id']) })
    photos: Pick<Photo, 'id'>[];
}

export class GetAllPointsToSecureResponse extends OmitType(GetPointToSecureResponse, ['safetyEquipmentType', 'photos']) {}

export class GetTeamResponse extends IntersectionType(Team, PickType(TeamRelations, ['users'])) {}

export class GetMemberResponse extends PickType(User, ['id', 'name']) {}

export class GetAdminResponse extends PartialType(PickType(User, ['id'])) {}

export class CreateTransferResponse {
    @ApiProperty()
    ip: string;

    @ApiProperty()
    port: number;

    @ApiProperty({
        required: false,
    })
    projectId?: string;

    @ApiProperty()
    transferId: string;
}

export class GetTransferResponse extends PickType(Transfer, ['type']) {
    @ApiProperty({
        required: false,
    })
    data?: ProjectAndTeams;
}

export class GetTransferPlanningResponse extends IntersectionType(Project, SafetyEquipments) {}

export class GetSafetyEquipmentTypeResponse extends IntersectionType(SafetyEquipmentType, PickType(SafetyEquipmentTypeRelations, ['lengths'])) {}
