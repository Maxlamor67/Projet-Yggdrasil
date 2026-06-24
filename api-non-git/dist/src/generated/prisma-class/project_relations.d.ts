import { PointToSecure } from './point_to_secure';
import { Geometry } from './geometry';
import { Team } from './team';
import { Transfer } from './transfer';
import { SafetyEquipment } from './safety_equipment';
import { AttentionPoint } from './attention_point';
export declare class ProjectRelations {
    pointsToSecure: PointToSecure[];
    geometries: Geometry[];
    teams: Team[];
    transfers: Transfer[];
    safetyEquipments: SafetyEquipment[];
    attentionPoints: AttentionPoint[];
}
