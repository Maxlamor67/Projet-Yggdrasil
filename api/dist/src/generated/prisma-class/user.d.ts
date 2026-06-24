import { UserRole } from '@prisma/client';
export declare class User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phone?: string;
    image?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
    isAnonymous?: boolean;
}
