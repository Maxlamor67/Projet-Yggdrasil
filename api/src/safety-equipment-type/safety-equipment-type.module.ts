import { Module } from '@nestjs/common';
import { SafetyEquipmentTypeService } from './safety-equipment-type.service';
import { SafetyEquipmentTypeController } from './safety-equipment-type.controller';
import { LengthModule } from './length/length.module';

@Module({
  controllers: [SafetyEquipmentTypeController],
  providers: [SafetyEquipmentTypeService],
  imports: [LengthModule],
})
export class SafetyEquipmentTypeModule {}
