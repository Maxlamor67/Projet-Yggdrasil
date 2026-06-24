import { PointType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Point {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ enum: PointType, enumName: 'PointType' })
  type: PointType;

  @ApiProperty({ type: Number })
  latitude: number;

  @ApiProperty({ type: Number })
  longitude: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
