import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from "../../prisma/prisma.service";
export declare class TeamService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, createTeamDto: CreateTeamDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    findAll(projectId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }[]>;
    findOne(projectId: string, id: string): Promise<{
        users: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            phone: string | null;
            image: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            banned: boolean | null;
            banReason: string | null;
            banExpires: Date | null;
            isAnonymous: boolean | null;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    update(projectId: string, id: string, updateTeamDto: UpdateTeamDto): Promise<void>;
    remove(projectId: string, id: string): Promise<void>;
    findOnePlanning(projectId: string, id: string): Promise<({
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
    })[]>;
}
