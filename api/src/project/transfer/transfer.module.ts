import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import {AppService} from "../../app.service";
import {TransferController} from "./transfer.controller";

@Module({
  providers: [TransferService, AppService],
  controllers: [TransferController],
})
export class TransferModule {}
