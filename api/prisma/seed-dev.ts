import { Prisma, PrismaClient, SafetyEquipmentTypeModel } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDev() {
  console.log('Début du seed DEV...');

  await prisma.safetyEquipmentType.deleteMany();

  const safetyEquipmentTypes: Prisma.SafetyEquipmentTypeCreateInput[] = [
    {
      name: 'Glissières béton armé (GBA)',
      model: SafetyEquipmentTypeModel.OBSTACLE,
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
      model: SafetyEquipmentTypeModel.OBSTACLE,
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
      model: SafetyEquipmentTypeModel.OBSTACLE,
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
      model: SafetyEquipmentTypeModel.OBSTACLE,
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
      model: SafetyEquipmentTypeModel.OBSTACLE,
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
      model: SafetyEquipmentTypeModel.VEHICLE,
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
