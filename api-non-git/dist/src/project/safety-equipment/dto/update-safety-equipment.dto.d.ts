import { CreateSafetyEquipmentDto } from './create-safety-equipment.dto';
declare const UpdateSafetyEquipmentDto_base: import("@nestjs/common").Type<Partial<Omit<CreateSafetyEquipmentDto, "safetyEquipmentTypeLengthId">>>;
export declare class UpdateSafetyEquipmentDto extends UpdateSafetyEquipmentDto_base {
    items: number;
}
export {};
