import { PrismaService } from '../../prisma/prisma.service';
import { CreateGeometryDto } from './dto/create-geometry.dto';
import { UpdateGeometryDto } from './dto/update-geometry.dto';
export declare class GeometryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, dto: CreateGeometryDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        type: import(".prisma/client").$Enums.GeometryType;
    }>;
    remove(projectId: string, id: string): Promise<void>;
    update(projectId: string, id: string, dto: UpdateGeometryDto): Promise<void>;
    findAll(projectId: string): Promise<({
        route: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            geometryId: string;
            startAt: Date;
            slowerParticipantSpeedEstimate: number;
            fasterParticipantSpeedEstimate: number;
        };
        geometryPoints: ({
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
            geometryId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        type: import(".prisma/client").$Enums.GeometryType;
    })[]>;
    findOne(projectId: string, id: string): Promise<{
        route: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            geometryId: string;
            startAt: Date;
            slowerParticipantSpeedEstimate: number;
            fasterParticipantSpeedEstimate: number;
        };
        geometryPoints: ({
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
            geometryId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        type: import(".prisma/client").$Enums.GeometryType;
    }>;
}
