import { Project } from './project';
import { SafetyEquipmentTypeLength } from './safety_equipment_type_length';
import { Action } from './action';
import { SafetyEquipmentPoint } from './safety_equipment_point';
import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentRelations {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiProperty({ type: () => SafetyEquipmentTypeLength })
  safetyEquipmentTypeLength: SafetyEquipmentTypeLength;

  @ApiProperty({ isArray: true, type: () => Action })
  actions: Action[];

  @ApiProperty({ isArray: true, type: () => SafetyEquipmentPoint })
  safetyEquipmentPoints: SafetyEquipmentPoint[];
}
