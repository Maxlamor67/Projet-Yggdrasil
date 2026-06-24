import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import {PrismaModule} from "../../prisma/prisma.module";

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TeamService],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
