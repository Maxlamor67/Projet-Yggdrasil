"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const client_1 = require("@prisma/client");
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const plugins_1 = require("better-auth/plugins");
const libphonenumber_js_1 = require("libphonenumber-js");
const prisma = new client_1.PrismaClient();
exports.auth = (0, better_auth_1.betterAuth)({
    plugins: [
        (0, plugins_1.admin)(),
    ],
    databaseHooks: {
        user: {
            create: {
                before: async (user, _) => {
                    const existingAdmin = await prisma.user.findFirst({
                        where: {
                            role: client_1.UserRole.admin,
                        },
                        select: {
                            id: true,
                        }
                    });
                    if (!existingAdmin)
                        return { data: { ...user, role: client_1.UserRole.admin } };
                    if (user.phone && typeof user.phone === 'string' && !(0, libphonenumber_js_1.isValidPhoneNumber)(user.phone, 'FR')) {
                        throw new better_auth_1.APIError('BAD_REQUEST', {
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
                    if (user.phone && typeof user.phone === 'string' && !(0, libphonenumber_js_1.isValidPhoneNumber)(user.phone, 'FR')) {
                        throw new better_auth_1.APIError('BAD_REQUEST', {
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
    database: (0, prisma_1.prismaAdapter)(prisma, {
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
//# sourceMappingURL=auth.js.map