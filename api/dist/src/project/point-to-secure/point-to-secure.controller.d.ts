import { PointToSecureService } from './point-to-secure.service';
import { CreatePointToSecureDto } from './dto/create-point-to-secure.dto';
import { FilterPointToSecureDto } from './dto/filter-point-to-secure.dto';
import { UpdatePointToSecureDto } from "./dto/update-point-to-secure.dto";
import { Response } from "express";
export declare class PointToSecureController {
    private readonly service;
    constructor(service: PointToSecureService);
    create(projectId: string, dto: CreatePointToSecureDto): Promise<{
        id: string;
        createdAt: Date;
        comment: string | null;
        isTreated: boolean;
        updatedAt: Date;
        projectId: string;
        pointId: string;
        safetyEquipmentTypeId: string | null;
    }>;
    remove(projectId: string, id: string): Promise<void>;
    findAll(projectId: string, filters: FilterPointToSecureDto): Promise<({
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
        comment: string | null;
        isTreated: boolean;
        updatedAt: Date;
        projectId: string;
        pointId: string;
        safetyEquipmentTypeId: string | null;
    })[]>;
    findOne(projectId: string, id: string): Promise<{
        photos: {
            id: string;
        }[];
        point: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.PointType;
            latitude: number;
            longitude: number;
        };
        safetyEquipmentType: {
            name: string;
            id: string;
            model: import(".prisma/client").$Enums.SafetyEquipmentTypeModel;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        comment: string | null;
        isTreated: boolean;
        updatedAt: Date;
        projectId: string;
        pointId: string;
        safetyEquipmentTypeId: string | null;
    }>;
    update(projectId: string, id: string, dto: UpdatePointToSecureDto): Promise<void>;
    findTile(projectId: string, id: string, photoId: string, res: Response): Promise<void>;
}
