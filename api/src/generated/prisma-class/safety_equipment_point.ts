import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentPoint {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  safetyEquipmentId: string;

  @ApiProperty({ type: String })
  pointId: string;

  @ApiProperty({ type: Number })
  rank: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
