"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDev = seedDev;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedDev() {
    console.log('Début du seed DEV...');
    await prisma.safetyEquipmentType.deleteMany();
    const safetyEquipmentTypes = [
        {
            name: 'Glissières béton armé (GBA)',
            model: client_1.SafetyEquipmentTypeModel.OBSTACLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 1 },
                        { length: 2 },
                    ],
                },
            },
        },
        {
            name: 'Blocs de béton',
            model: client_1.SafetyEquipmentTypeModel.OBSTACLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 1 },
                        { length: 2.5 },
                    ],
                },
            },
        },
        {
            name: 'Barrières Vauban',
            model: client_1.SafetyEquipmentTypeModel.OBSTACLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 2 },
                    ],
                },
            },
        },
        {
            name: 'Barrières Héras',
            model: client_1.SafetyEquipmentTypeModel.OBSTACLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 3.5 },
                    ],
                },
            },
        },
        {
            name: 'Obstacles',
            model: client_1.SafetyEquipmentTypeModel.OBSTACLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 0.95 },
                        { length: 1.05 },
                    ],
                },
            },
        },
        {
            name: 'Engins de blocage',
            model: client_1.SafetyEquipmentTypeModel.VEHICLE,
            lengths: {
                createMany: {
                    data: [
                        { length: 8 },
                        { length: 9.35 },
                        { length: 9.5 },
                        { length: 11 },
                        { length: 16 },
                    ],
                },
            },
        },
    ];
    for (const type of safetyEquipmentTypes) {
        await prisma.safetyEquipmentType.create({
            data: type,
        });
    }
    console.log('Seed DEV terminé.');
}
//# sourceMappingURL=seed-dev.js.map