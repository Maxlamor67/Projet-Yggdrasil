import { ActionType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Action {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  safetyEquipmentId: string;

  @ApiPropertyOptional({ type: String })
  teamId?: string;

  @ApiProperty({ enum: ActionType, enumName: 'ActionType' })
  type: ActionType;

  @ApiProperty({ type: Date })
  realizedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
