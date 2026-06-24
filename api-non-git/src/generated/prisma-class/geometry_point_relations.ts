import { Geometry } from './geometry';
import { Point } from './point';
import { ApiProperty } from '@nestjs/swagger';

export class GeometryPointRelations {
  @ApiProperty({ type: () => Geometry })
  geometry: Geometry;

  @ApiProperty({ type: () => Point })
  point: Point;
}
