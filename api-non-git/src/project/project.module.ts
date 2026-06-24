import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import {PointToSecureModule} from "./point-to-secure/point-to-secure.module";
import {GeometryModule} from "./geometry/geometry.module";
import { TeamModule } from './team/team.module';
import {TransferModule} from "./transfer/transfer.module";
import {SafetyEquipmentModule} from "./safety-equipment/safety-equipment.module";
import { AttentionPointModule } from './attention-point/attention-point.module';

@Module({
  imports: [
      PointToSecureModule,
      GeometryModule,
      TeamModule,
      TransferModule,
      SafetyEquipmentModule,
      AttentionPointModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
