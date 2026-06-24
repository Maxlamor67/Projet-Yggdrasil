import { ApiProperty } from '@nestjs/swagger';

export class Photo {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  pointToSecureId: string;

  @ApiProperty({ type: String })
  mimeType: string;

  @ApiProperty({ type: Buffer })
  data: Buffer;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
