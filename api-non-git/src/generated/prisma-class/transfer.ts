import { TransferType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Transfer {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  projectId: string;

  @ApiProperty({ enum: TransferType, enumName: 'TransferType' })
  type: TransferType;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
