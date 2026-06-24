import { SafetyEquipmentTypeModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SafetyEquipmentType {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({
    enum: SafetyEquipmentTypeModel,
    enumName: 'SafetyEquipmentTypeModel',
  })
  model: SafetyEquipmentTypeModel;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
