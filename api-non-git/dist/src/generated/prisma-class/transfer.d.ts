import { TransferType } from '@prisma/client';
export declare class Transfer {
    id: string;
    projectId: string;
    type: TransferType;
    createdAt: Date;
}
