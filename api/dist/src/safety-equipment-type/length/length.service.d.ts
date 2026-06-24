import { CreateLengthDto } from './dto/create-length.dto';
import { UpdateLengthDto } from './dto/update-length.dto';
import { PrismaService } from "../../prisma/prisma.service";
export declare class LengthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(safetyEquipmentTypeId: string, createLengthDto: CreateLengthDto): Promise<{
        length: number;
        id: string;
        createdAt: Date;
        safetyEquipmentTypeId: string;
    }>;
    update(safetyEquipmentTypeId: string, id: string, updateLengthDto: UpdateLengthDto): Promise<void>;
    remove(safetyEquipmentTypeId: string, id: string): Promise<void>;
}
