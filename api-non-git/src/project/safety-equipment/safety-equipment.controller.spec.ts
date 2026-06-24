import { Test, TestingModule } from '@nestjs/testing';
import { SafetyEquipmentController } from './safety-equipment.controller';
import { SafetyEquipmentService } from './safety-equipment.service';
import {PrismaModule} from "../../prisma/prisma.module";

describe('SafetyEquipmentController', () => {
  let controller: SafetyEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [SafetyEquipmentController],
      providers: [SafetyEquipmentService],
    }).compile();

    controller = module.get<SafetyEquipmentController>(SafetyEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
