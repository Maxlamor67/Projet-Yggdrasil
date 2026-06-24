import { SafetyEquipment } from './safety_equipment';
import { Point } from './point';
import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentPointRelations {
  @ApiProperty({ type: () => SafetyEquipment })
  safetyEquipment: SafetyEquipment;

  @ApiProperty({ type: () => Point })
  point: Point;
}
