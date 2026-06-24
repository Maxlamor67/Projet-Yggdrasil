import { PartialType } from '@nestjs/swagger';
import { CreateLengthDto } from './create-length.dto';

export class UpdateLengthDto extends PartialType(CreateLengthDto) {}
