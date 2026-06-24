import { Module } from '@nestjs/common';
import { GeometryService } from './geometry.service';
import { GeometryController } from './geometry.controller';

@Module({
  controllers: [GeometryController],
  providers: [GeometryService],
})
export class GeometryModule {}
