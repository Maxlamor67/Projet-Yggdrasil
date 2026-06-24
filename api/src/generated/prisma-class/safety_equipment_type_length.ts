import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentTypeLength {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  safetyEquipmentTypeId: string;

  @ApiProperty({ type: Number })
  length: number;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
