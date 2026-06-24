import { ApiProperty } from '@nestjs/swagger';

export class Route {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  geometryId: string;

  @ApiProperty({ type: Date })
  startAt: Date;

  @ApiProperty({ type: Number })
  slowerParticipantSpeedEstimate: number;

  @ApiProperty({ type: Number })
  fasterParticipantSpeedEstimate: number;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
