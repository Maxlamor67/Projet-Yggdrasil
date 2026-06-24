import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import {MemberModule} from "./member/member.module";

@Module({
  imports: [
      MemberModule,
  ],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
