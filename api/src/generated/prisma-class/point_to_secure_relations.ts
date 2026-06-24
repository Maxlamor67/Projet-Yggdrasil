import { Project } from './project';
import { Photo } from './photo';
import { SafetyEquipmentType } from './safety_equipment_type';
import { Point } from './point';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PointToSecureRelations {
  @ApiProperty({ type: () => Project })
  project: Project;

  @ApiProperty({ isArray: true, type: () => Photo })
  photos: Photo[];

  @ApiPropertyOptional({ type: () => SafetyEquipmentType })
  safetyEquipmentType?: SafetyEquipmentType;

  @ApiProperty({ type: () => Point })
  point: Point;
}
