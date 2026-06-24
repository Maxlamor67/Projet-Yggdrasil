import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipment {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  projectId: string;

  @ApiProperty({ type: String })
  safetyEquipmentTypeLengthId: string;

  @ApiProperty({ type: Number })
  safetyEquipmentTypeLengthCount: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
