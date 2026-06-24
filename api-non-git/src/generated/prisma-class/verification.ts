import { ApiProperty } from '@nestjs/swagger';

export class Verification {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  identifier: string;

  @ApiProperty({ type: String })
  value: string;

  @ApiProperty({ type: Date })
  expiresAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
