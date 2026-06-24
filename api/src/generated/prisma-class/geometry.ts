import { GeometryType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Geometry {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  projectId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ enum: GeometryType, enumName: 'GeometryType' })
  type: GeometryType;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
