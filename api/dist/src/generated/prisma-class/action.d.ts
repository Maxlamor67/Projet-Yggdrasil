import { ActionType } from '@prisma/client';
export declare class Action {
    id: string;
    safetyEquipmentId: string;
    teamId?: string;
    type: ActionType;
    realizedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
