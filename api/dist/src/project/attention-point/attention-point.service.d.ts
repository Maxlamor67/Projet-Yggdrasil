import { CreateAttentionPointDto } from './dto/create-attention-point.dto';
import { PrismaService } from "../../prisma/prisma.service";
export declare class AttentionPointService {
    private prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, dto: CreateAttentionPointDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        pointId: string;
        description: string;
    }>;
    remove(projectId: string, id: string): Promise<void>;
    findAll(projectId: string): Promise<({
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
        projectId: string;
        pointId: string;
        description: string;
    })[]>;
    findOne(projectId: string, id: string): Promise<{
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
        projectId: string;
        pointId: string;
        description: string;
    }>;
}
