import { Project } from './project';
import { Route } from './route';
import { GeometryPoint } from './geometry_point';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeometryRelations {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiPropertyOptional({ type: () => Route })
  route?: Route;

  @ApiProperty({ isArray: true, type: () => GeometryPoint })
  geometryPoints: GeometryPoint[];
}
