import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class SessionRelations {
  @ApiProperty({ type: () => User })
  user: User;
}
