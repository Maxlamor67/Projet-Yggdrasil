import { TransferService } from "./transfer.service";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { ImportRawDataDto } from "./dto/import-data.dto";
export declare class TransferController {
    private readonly transferService;
    constructor(transferService: TransferService);
    create(projectId: string, setupTransferDto: CreateTransferDto): Promise<{
        ip: string;
        port: number;
        projectId: string;
        transferId: string;
    }>;
    joinTransfer(projectId: string, id: string): Promise<{
        type: import(".prisma/client").$Enums.TransferType;
        data: object;
    }>;
    importData(projectId: string, id: string, dto: ImportRawDataDto, rawPhotos: Array<Express.Multer.File>): Promise<void>;
    exportPlanningData(projectId: string, id: string, teamId: string): Promise<{
        safetyEquipments: ({
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
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startAtDate: Date | null;
        endAtDate: Date | null;
    }>;
}
