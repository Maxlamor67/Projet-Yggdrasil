import { Geometry } from './geometry';
import { ApiProperty } from '@nestjs/swagger';

export class RouteRelations {
  @ApiProperty({ type: () => Geometry })
  geometry: Geometry;
}
