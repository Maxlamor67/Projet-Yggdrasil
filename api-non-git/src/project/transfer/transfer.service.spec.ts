import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import {PrismaModule} from "../../prisma/prisma.module";
import {AppService} from "../../app.service";

describe('TransferService', () => {
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [TransferService, AppService],
    }).compile();

    service = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
