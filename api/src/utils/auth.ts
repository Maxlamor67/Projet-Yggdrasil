import {PrismaClient, UserRole} from "@prisma/client";
import {APIError, betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {admin} from "better-auth/plugins";
import {isValidPhoneNumber} from "libphonenumber-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [
        admin(),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user, _) => {
                    const existingAdmin = await prisma.user.findFirst({
                        where: {
                            role: UserRole.admin,
                        },
                        select: {
                            id: true,
                        }
                    });

                    if (!existingAdmin) return { data: { ...user, role: UserRole.admin } };

                    if (user.phone && typeof user.phone === 'string' && !isValidPhoneNumber(user.phone, 'FR')) {
                        throw new APIError('BAD_REQUEST', {
                            statusCode: 400,
                            error: 'Le numéro de téléphone n\'est pas valide.',
                        });
                    }

                    return {
                        data: user
                    };
                },
            },
            update: {
                before: async (user, _) => {
                    if (user.phone && typeof user.phone === 'string' && !isValidPhoneNumber(user.phone, 'FR')) {
                        throw new APIError('BAD_REQUEST', {
                            statusCode: 400,
                            error: 'Le numéro de téléphone n\'est pas valide.',
                        });
                    }

                    return {
                        data: user
                    };
                },
            },
        },
    },
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        disableOriginCheck: true,
    },
    basePath: "auth",
    hooks: {},
    user: {
        modelName: "User",
        additionalFields: {
            role: {
                type: "string",
                returned: true,
            },
            phone: {
                type: "string",
                returned: true,
                required: false,
            },
        },
    },
    session: {
        modelName: "Session",
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
});