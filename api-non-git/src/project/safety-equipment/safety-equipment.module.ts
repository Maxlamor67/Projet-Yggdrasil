import { Module } from '@nestjs/common';
import { SafetyEquipmentService } from './safety-equipment.service';
import { SafetyEquipmentController } from './safety-equipment.controller';
import { ActionModule } from './action/action.module';

@Module({
  controllers: [SafetyEquipmentController],
  providers: [SafetyEquipmentService],
  imports: [ActionModule],
})
export class SafetyEquipmentModule {}
