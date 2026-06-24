import { GeometryPoint } from './geometry_point';
import { SafetyEquipmentPoint } from './safety_equipment_point';
import { PointToSecure } from './point_to_secure';
import { AttentionPoint } from './attention_point';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PointRelations {
  @ApiPropertyOptional({ type: () => GeometryPoint })
  geometryPoint?: GeometryPoint;

  @ApiPropertyOptional({ type: () => SafetyEquipmentPoint })
  safetyEquipmentPoint?: SafetyEquipmentPoint;

  @ApiPropertyOptional({ type: () => PointToSecure })
  pointToSecure?: PointToSecure;

  @ApiPropertyOptional({ type: () => AttentionPoint })
  attentionPoint?: AttentionPoint;
}
