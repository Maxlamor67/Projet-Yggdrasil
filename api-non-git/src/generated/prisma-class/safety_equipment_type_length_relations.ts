import { SafetyEquipmentType } from './safety_equipment_type';
import { SafetyEquipment } from './safety_equipment';
import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentTypeLengthRelations {
  @ApiProperty({ type: () => SafetyEquipmentType })
  safetyEquipmentType: SafetyEquipmentType;

  @ApiProperty({ isArray: true, type: () => SafetyEquipment })
  safetyEquipments: SafetyEquipment[];
}
