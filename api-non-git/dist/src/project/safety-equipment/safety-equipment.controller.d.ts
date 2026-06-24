import { SafetyEquipmentService } from './safety-equipment.service';
import { CreateSafetyEquipmentDto } from './dto/create-safety-equipment.dto';
import { UpdateSafetyEquipmentDto } from './dto/update-safety-equipment.dto';
export declare class SafetyEquipmentController {
    private readonly safetyEquipmentService;
    constructor(safetyEquipmentService: SafetyEquipmentService);
    create(projectId: string, dto: CreateSafetyEquipmentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        safetyEquipmentTypeLengthCount: number;
        safetyEquipmentTypeLengthId: string;
    }>;
    remove(projectId: string, id: string): Promise<void>;
    findAll(projectId: string): Promise<({
        safetyEquipmentTypeLength: {
            safetyEquipmentType: {
                name: string;
                id: string;
                model: import(".prisma/client").$Enums.SafetyEquipmentTypeModel;
                createdAt: Date;
            };
        } & {
            length: number;
            id: string;
            createdAt: Date;
            safetyEquipmentTypeId: string;
        };
        actions: ({
            team: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                projectId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ActionType;
            safetyEquipmentId: string;
            realizedAt: Date;
            teamId: string | null;
        })[];
        safetyEquipmentPoints: ({
            point: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.PointType;
                latitude: number;
                longitude: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pointId: string;
            rank: number;
            safetyEquipmentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        safetyEquipmentTypeLengthCount: number;
        safetyEquipmentTypeLengthId: string;
    })[]>;
    findOne(projectId: string, id: string): Promise<{
        safetyEquipmentTypeLength: {
            safetyEquipmentType: {
                name: string;
                id: string;
                model: import(".prisma/client").$Enums.SafetyEquipmentTypeModel;
                createdAt: Date;
            };
        } & {
            length: number;
            id: string;
            createdAt: Date;
            safetyEquipmentTypeId: string;
        };
        actions: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ActionType;
            safetyEquipmentId: string;
            realizedAt: Date;
            teamId: string | null;
        }[];
        safetyEquipmentPoints: ({
            point: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                type: import(".prisma/client").$Enums.PointType;
                latitude: number;
                longitude: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            pointId: string;
            rank: number;
            safetyEquipmentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        safetyEquipmentTypeLengthCount: number;
        safetyEquipmentTypeLengthId: string;
    }>;
    update(projectId: string, id: string, dto: UpdateSafetyEquipmentDto): Promise<void>;
}
