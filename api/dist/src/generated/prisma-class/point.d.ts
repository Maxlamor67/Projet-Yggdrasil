import { PointType } from '@prisma/client';
export declare class Point {
    id: string;
    type: PointType;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}
