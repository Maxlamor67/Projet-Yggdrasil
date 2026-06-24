import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PointToSecure {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  projectId: string;

  @ApiProperty({ type: String })
  pointId: string;

  @ApiPropertyOptional({ type: String })
  safetyEquipmentTypeId?: string;

  @ApiPropertyOptional({ type: String })
  comment?: string;

  @ApiProperty({ type: Boolean })
  isTreated: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
