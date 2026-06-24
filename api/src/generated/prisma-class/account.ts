import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Account {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  accountId: string;

  @ApiProperty({ type: String })
  providerId: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiPropertyOptional({ type: String })
  accessToken?: string;

  @ApiPropertyOptional({ type: String })
  refreshToken?: string;

  @ApiPropertyOptional({ type: String })
  idToken?: string;

  @ApiPropertyOptional({ type: Date })
  accessTokenExpiresAt?: Date;

  @ApiPropertyOptional({ type: Date })
  refreshTokenExpiresAt?: Date;

  @ApiPropertyOptional({ type: String })
  scope?: string;

  @ApiPropertyOptional({ type: String })
  password?: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
