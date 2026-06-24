import { Module } from '@nestjs/common';
import { LengthService } from './length.service';
import { LengthController } from './length.controller';

@Module({
  controllers: [LengthController],
  providers: [LengthService],
})
export class LengthModule {}
