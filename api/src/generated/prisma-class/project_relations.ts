import { PointToSecure } from './point_to_secure';
import { Geometry } from './geometry';
import { Team } from './team';
import { Transfer } from './transfer';
import { SafetyEquipment } from './safety_equipment';
import { AttentionPoint } from './attention_point';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectRelations {
  @ApiProperty({ isArray: true, type: () => PointToSecure })
  pointsToSecure: PointToSecure[];

  @ApiProperty({ isArray: true, type: () => Geometry })
  geometries: Geometry[];

  @ApiProperty({ isArray: true, type: () => Team })
  teams: Team[];

  @ApiProperty({ isArray: true, type: () => Transfer })
  transfers: Transfer[];

  @ApiProperty({ isArray: true, type: () => SafetyEquipment })
  safetyEquipments: SafetyEquipment[];

  @ApiProperty({ isArray: true, type: () => AttentionPoint })
  attentionPoints: AttentionPoint[];
}
