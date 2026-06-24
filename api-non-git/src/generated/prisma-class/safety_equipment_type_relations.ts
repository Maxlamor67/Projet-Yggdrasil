import { PointToSecure } from './point_to_secure';
import { SafetyEquipmentTypeLength } from './safety_equipment_type_length';
import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentTypeRelations {
  @ApiProperty({ isArray: true, type: () => PointToSecure })
  pointsToSecure: PointToSecure[];

  @ApiProperty({ isArray: true, type: () => SafetyEquipmentTypeLength })
  lengths: SafetyEquipmentTypeLength[];
}
