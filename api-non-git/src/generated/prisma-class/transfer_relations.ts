import { Project } from './project';
import { ApiProperty } from '@nestjs/swagger';

export class TransferRelations {
  @ApiProperty({ type: () => Project })
  project: Project;
}
