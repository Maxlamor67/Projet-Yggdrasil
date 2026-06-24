import { Point } from './point';
import { Project } from './project';
import { ApiProperty } from '@nestjs/swagger';

export class AttentionPointRelations {
  @ApiProperty({ type: () => Point })
  point: Point;

  @ApiProperty({ type: () => Project })
  project: Project;
}
