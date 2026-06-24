import { Module } from '@nestjs/common';
import { AttentionPointService } from './attention-point.service';
import { AttentionPointController } from './attention-point.controller';

@Module({
  controllers: [AttentionPointController],
  providers: [AttentionPointService],
})
export class AttentionPointModule {}
