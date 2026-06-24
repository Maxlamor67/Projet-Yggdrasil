import { PointToSecure } from './point_to_secure';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoRelations {
  @ApiProperty({ type: () => PointToSecure })
  pointToSecure: PointToSecure;
}
