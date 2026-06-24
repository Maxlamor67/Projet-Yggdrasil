import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import {PrismaModule} from "../../../prisma/prisma.module";

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ActionService],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
