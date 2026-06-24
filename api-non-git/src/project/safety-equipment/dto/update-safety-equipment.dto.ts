import {OmitType, PartialType} from '@nestjs/swagger';
import { CreateSafetyEquipmentDto } from './create-safety-equipment.dto';
import {IsNumber, IsOptional, Min} from "class-validator";
import {Type} from "class-transformer";

export class UpdateSafetyEquipmentDto extends PartialType(OmitType(CreateSafetyEquipmentDto, ['safetyEquipmentTypeLengthId'])) {
    @Type(() => Number)
    @IsNumber({}, { message: 'Le nombre d\'équipements doit être un nombre'})
    @Min(1, { message: 'Le nombre d\'équipements doit être au minimum 1'})
    @IsOptional()
    items: number;
}
