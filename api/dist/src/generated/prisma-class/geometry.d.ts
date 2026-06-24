import { GeometryType } from '@prisma/client';
export declare class Geometry {
    id: string;
    projectId: string;
    name: string;
    type: GeometryType;
    createdAt: Date;
    updatedAt: Date;
}
