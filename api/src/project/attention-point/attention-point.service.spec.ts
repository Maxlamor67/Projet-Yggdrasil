import { Test, TestingModule } from '@nestjs/testing';
import { AttentionPointService } from './attention-point.service';
import {PrismaModule} from "../../prisma/prisma.module";

describe('AttentionPointService', () => {
  let service: AttentionPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [AttentionPointService],
    }).compile();

    service = module.get<AttentionPointService>(AttentionPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
