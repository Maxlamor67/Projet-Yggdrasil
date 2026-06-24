import { SafetyEquipment } from './safety_equipment';
import { Team } from './team';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActionRelations {
  @ApiProperty({ type: () => SafetyEquipment })
  safetyEquipment: SafetyEquipment;

  @ApiPropertyOptional({ type: () => Team })
  team?: Team;
}
