import { Test, TestingModule } from '@nestjs/testing';
import { AttentionPointController } from './attention-point.controller';
import { AttentionPointService } from './attention-point.service';
import {PrismaModule} from "../../prisma/prisma.module";

describe('AttentionPointController', () => {
  let controller: AttentionPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AttentionPointController],
      providers: [AttentionPointService],
    }).compile();

    controller = module.get<AttentionPointController>(AttentionPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
