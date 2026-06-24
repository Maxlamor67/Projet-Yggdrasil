import {OmitType, PartialType} from '@nestjs/swagger';
import { CreateSafetyEquipmentTypeDto } from './create-safety-equipment-type.dto';

export class UpdateSafetyEquipmentTypeDto extends PartialType(OmitType(CreateSafetyEquipmentTypeDto, ['lengths', 'model'])) {}
