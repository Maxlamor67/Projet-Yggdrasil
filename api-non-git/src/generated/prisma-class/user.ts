import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: Boolean })
  emailVerified: boolean;

  @ApiPropertyOptional({ type: String })
  phone?: string;

  @ApiPropertyOptional({ type: String })
  image?: string;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole = UserRole.user;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Boolean })
  banned?: boolean;

  @ApiPropertyOptional({ type: String })
  banReason?: string;

  @ApiPropertyOptional({ type: Date })
  banExpires?: Date;

  @ApiPropertyOptional({ type: Boolean })
  isAnonymous?: boolean;
}
