import { Module } from '@nestjs/common';
import { PointToSecureService } from './point-to-secure.service';
import { PointToSecureController } from './point-to-secure.controller';

@Module({
  controllers: [PointToSecureController],
  providers: [PointToSecureService],
})
export class PointToSecureModule {}
