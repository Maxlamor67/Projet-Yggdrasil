import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Session {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  expiresAt: Date;

  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: String })
  ipAddress?: string;

  @ApiPropertyOptional({ type: String })
  userAgent?: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  impersonatedBy?: string;
}
