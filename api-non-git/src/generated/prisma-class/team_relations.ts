import { Project } from './project';
import { Action } from './action';
import { User } from './user';
import { ApiProperty } from '@nestjs/swagger';

export class TeamRelations {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiProperty({ isArray: true, type: () => Action })
  actions: Action[];

  @ApiProperty({ isArray: true, type: () => User })
  users: User[];
}
