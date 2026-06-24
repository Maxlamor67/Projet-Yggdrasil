import { Session } from './session';
import { Account } from './account';
import { Team } from './team';
import { ApiProperty } from '@nestjs/swagger';

export class UserRelations {
  @ApiProperty({ isArray: true, type: () => Session })
  sessions: Session[];

  @ApiProperty({ isArray: true, type: () => Account })
  accounts: Account[];

  @ApiProperty({ isArray: true, type: () => Team })
  teams: Team[];
}
