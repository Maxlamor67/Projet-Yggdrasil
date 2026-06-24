import { Test, TestingModule } from '@nestjs/testing';
import { SafetyEquipmentService } from './safety-equipment.service';
import {PrismaModule} from "../../prisma/prisma.module";

describe('SafetyEquipmentService', () => {
  let service: SafetyEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SafetyEquipmentService],
    }).compile();

    service = module.get<SafetyEquipmentService>(SafetyEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
