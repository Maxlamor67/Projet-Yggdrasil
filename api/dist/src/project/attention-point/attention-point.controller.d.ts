import { AttentionPointService } from './attention-point.service';
import { CreateAttentionPointDto } from './dto/create-attention-point.dto';
export declare class AttentionPointController {
    private readonly attentionPointService;
    constructor(attentionPointService: AttentionPointService);
    create(projectId: string, createAttentionPointDto: CreateAttentionPointDto): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        pointId: string;
        description: string;
    }>;
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
    remove(projectId: string, id: string): Promise<void>;
}
