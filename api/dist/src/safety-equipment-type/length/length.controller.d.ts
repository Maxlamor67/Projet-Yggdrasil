import { LengthService } from './length.service';
import { CreateLengthDto } from './dto/create-length.dto';
import { UpdateLengthDto } from './dto/update-length.dto';
export declare class LengthController {
    private readonly lengthService;
    constructor(lengthService: LengthService);
    create(safetyEquipmentTypeId: string, createLengthDto: CreateLengthDto): Promise<{
        length: number;
        id: string;
        createdAt: Date;
        safetyEquipmentTypeId: string;
    }>;
    update(safetyEquipmentTypeId: string, id: string, updateLengthDto: UpdateLengthDto): Promise<void>;
    remove(safetyEquipmentTypeId: string, id: string): Promise<void>;
}
