import { CreateSafetyEquipmentTypeDto } from './dto/create-safety-equipment-type.dto';
import { UpdateSafetyEquipmentTypeDto } from './dto/update-safety-equipment-type.dto';
import { PrismaService } from "../prisma/prisma.service";
export declare class SafetyEquipmentTypeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createSafetyEquipmentTypeDto: CreateSafetyEquipmentTypeDto): Promise<{
        name: string;
        id: string;
        model: import(".prisma/client").$Enums.SafetyEquipmentTypeModel;
        createdAt: Date;
    }>;
    findAll(): Promise<({
        lengths: {
            length: number;
            id: string;
            createdAt: Date;
            safetyEquipmentTypeId: string;
        }[];
    } & {
        name: string;
        id: string;
        model: import(".prisma/client").$Enums.SafetyEquipmentTypeModel;
        createdAt: Date;
    })[]>;
    update(id: string, updateSafetyEquipmentTypeDto: UpdateSafetyEquipmentTypeDto): Promise<void>;
    remove(id: string): Promise<void>;
}
