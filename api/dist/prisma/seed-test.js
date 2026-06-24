"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTest = seedTest;
exports.seedTestAndClose = seedTestAndClose;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedTest() {
    console.log('Début du seed TEST...');
    await prisma.photo.deleteMany();
    await prisma.pointToSecure.deleteMany();
    await prisma.attentionPoint.deleteMany();
    await prisma.action.deleteMany();
    await prisma.safetyEquipmentPoint.deleteMany();
    await prisma.safetyEquipment.deleteMany();
    await prisma.geometryPoint.deleteMany();
    await prisma.route.deleteMany();
    await prisma.geometry.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.team.deleteMany();
    await prisma.point.deleteMany();
    await prisma.project.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.safetyEquipmentTypeLength.deleteMany();
    await prisma.safetyEquipmentType.deleteMany();
    const safetyEquipmentTypes = [
        { name: 'Glissières béton armé (GBA)', model: client_1.SafetyEquipmentTypeModel.OBSTACLE, lengths: { createMany: { data: [{ length: 1 }, { length: 2 }] } } },
        { name: 'Blocs de béton', model: client_1.SafetyEquipmentTypeModel.OBSTACLE, lengths: { createMany: { data: [{ length: 1 }, { length: 2.5 }] } } },
        { name: 'Barrières Vauban', model: client_1.SafetyEquipmentTypeModel.OBSTACLE, lengths: { createMany: { data: [{ length: 2 }] } } },
        { name: 'Barrières Héras', model: client_1.SafetyEquipmentTypeModel.OBSTACLE, lengths: { createMany: { data: [{ length: 3.5 }] } } },
        { name: 'Obstacles', model: client_1.SafetyEquipmentTypeModel.OBSTACLE, lengths: { createMany: { data: [{ length: 0.95 }, { length: 1.05 }] } } },
        {
            name: 'Engins de blocage',
            model: client_1.SafetyEquipmentTypeModel.VEHICLE,
            lengths: { createMany: { data: [{ length: 8 }, { length: 9.35 }, { length: 9.5 }, { length: 11 }, { length: 16 }] } },
        },
    ];
    for (const type of safetyEquipmentTypes) {
        await prisma.safetyEquipmentType.create({ data: type });
    }
    const vehicleType = await prisma.safetyEquipmentType.findFirstOrThrow({
        where: { model: client_1.SafetyEquipmentTypeModel.VEHICLE },
        include: { lengths: true },
    });
    const obstacleType = await prisma.safetyEquipmentType.findFirstOrThrow({
        where: { model: client_1.SafetyEquipmentTypeModel.OBSTACLE },
        include: { lengths: true },
    });
    const vehicleLength = vehicleType.lengths[0];
    const obstacleLength = obstacleType.lengths[0];
    if (!vehicleLength || !obstacleLength)
        throw new Error('Seed-test: lengths manquantes pour VEHICLE/OBSTACLE');
    const admin = await prisma.user.create({
        data: {
            id: 'admin-test',
            name: 'Admin Test',
            email: 'admin.test@nidhoggr.local',
            role: client_1.UserRole.admin,
            emailVerified: true,
        },
    });
    const userA = await prisma.user.create({
        data: {
            id: 'user-a-test',
            name: 'User A Test',
            email: 'user.a.test@nidhoggr.local',
            role: client_1.UserRole.user,
            emailVerified: true,
        },
    });
    const userB = await prisma.user.create({
        data: {
            id: 'user-b-test',
            name: 'User B Test',
            email: 'user.b.test@nidhoggr.local',
            role: client_1.UserRole.user,
            emailVerified: true,
        },
    });
    const project = await prisma.project.create({
        data: {
            name: 'Test Project',
            startAtDate: new Date('2026-01-10T08:00:00.000Z'),
            endAtDate: new Date('2026-01-20T18:00:00.000Z'),
        },
    });
    const project2 = await prisma.project.create({
        data: {
            name: 'Test Project 2',
            startAtDate: new Date('2026-02-01T08:00:00.000Z'),
            endAtDate: new Date('2026-02-02T18:00:00.000Z'),
        },
    });
    const project3 = await prisma.project.create({
        data: {
            name: 'Test Project 3',
            startAtDate: new Date('2026-03-01T08:00:00.000Z'),
            endAtDate: new Date('2026-03-15T18:00:00.000Z'),
        },
    });
    const team = await prisma.team.create({
        data: {
            name: 'Team Test',
            projectId: project.id,
            users: { connect: [{ id: admin.id }, { id: userA.id }] },
        },
    });
    const team2 = await prisma.team.create({
        data: {
            name: 'Team Alpha',
            projectId: project.id,
            users: { connect: [{ id: userB.id }] },
        },
    });
    const team3 = await prisma.team.create({
        data: {
            name: 'Team Beta',
            projectId: project.id,
            users: { connect: [{ id: userA.id }] },
        },
    });
    const ptsPoint = await prisma.point.create({
        data: { type: client_1.PointType.POINT_TO_SECURE, latitude: 48.58392, longitude: 7.74553 },
    });
    const pts = await prisma.pointToSecure.create({
        data: {
            projectId: project.id,
            pointId: ptsPoint.id,
            comment: 'Point à sécuriser (test)',
            isTreated: false,
            safetyEquipmentTypeId: obstacleType.id,
        },
    });
    const png1x1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2yXvQAAAAASUVORK5CYII=';
    const photo = await prisma.photo.create({
        data: {
            pointToSecureId: pts.id,
            mimeType: 'image/png',
            data: Buffer.from(png1x1, 'base64'),
        },
    });
    const ptsPoint2 = await prisma.point.create({
        data: { type: client_1.PointType.POINT_TO_SECURE, latitude: 48.5845, longitude: 7.7468 },
    });
    await prisma.pointToSecure.create({
        data: {
            projectId: project.id,
            pointId: ptsPoint2.id,
            comment: 'Point à sécuriser (test 2)',
            isTreated: true,
            safetyEquipmentTypeId: obstacleType.id,
        },
    });
    await prisma.geometry.create({
        data: {
            projectId: project.id,
            name: 'Zone Test',
            type: client_1.GeometryType.AREA,
            geometryPoints: {
                create: [
                    { rank: 1, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5841, longitude: 7.7449 } } },
                    { rank: 2, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5841, longitude: 7.7462 } } },
                    { rank: 3, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5833, longitude: 7.7462 } } },
                    { rank: 4, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5833, longitude: 7.7449 } } },
                ],
            },
        },
    });
    const routeGeom = await prisma.geometry.create({
        data: {
            projectId: project.id,
            name: 'Parcours Test',
            type: client_1.GeometryType.ROUTE,
            route: {
                create: {
                    startAt: new Date('2026-01-12T09:00:00.000Z'),
                    slowerParticipantSpeedEstimate: 4.0,
                    fasterParticipantSpeedEstimate: 6.0,
                },
            },
            geometryPoints: {
                create: [
                    { rank: 1, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5836, longitude: 7.7448 } } },
                    { rank: 2, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5839, longitude: 7.7455 } } },
                    { rank: 3, point: { create: { type: client_1.PointType.GEOMETRY, latitude: 48.5842, longitude: 7.746 } } },
                ],
            },
        },
    });
    const seVehicle = await prisma.safetyEquipment.create({
        data: {
            projectId: project.id,
            safetyEquipmentTypeLengthId: vehicleLength.id,
            safetyEquipmentTypeLengthCount: 1,
            safetyEquipmentPoints: {
                create: [{ rank: 1, point: { create: { type: client_1.PointType.SAFETY_EQUIPMENT, latitude: 48.5837, longitude: 7.745 } } }],
            },
            actions: {
                create: [
                    { type: client_1.ActionType.SET, realizedAt: new Date('2026-01-11T10:00:00.000Z'), teamId: team.id },
                    { type: client_1.ActionType.UNSET, realizedAt: new Date('2026-01-12T10:00:00.000Z'), teamId: team2.id },
                ],
            },
        },
        include: { actions: true },
    });
    const seObstacle = await prisma.safetyEquipment.create({
        data: {
            projectId: project.id,
            safetyEquipmentTypeLengthId: obstacleLength.id,
            safetyEquipmentTypeLengthCount: 2,
            safetyEquipmentPoints: {
                create: [{ rank: 1, point: { create: { type: client_1.PointType.SAFETY_EQUIPMENT, latitude: 48.5838, longitude: 7.7458 } } }],
            },
            actions: {
                create: [
                    { type: client_1.ActionType.SET, realizedAt: new Date('2026-01-11T12:00:00.000Z'), teamId: team.id },
                    { type: client_1.ActionType.UNSET, realizedAt: new Date('2026-01-12T12:00:00.000Z'), teamId: team.id },
                ],
            },
        },
        include: { actions: true },
    });
    const apPoint = await prisma.point.create({
        data: { type: client_1.PointType.ATTENTION_POINT, latitude: 48.5832, longitude: 7.7452 },
    });
    await prisma.attentionPoint.create({
        data: { projectId: project.id, pointId: apPoint.id, description: 'Attention (seed-test)' },
    });
    const transferA = await prisma.transfer.create({ data: { projectId: project.id, type: client_1.TransferType.APP_TO_SOFTWARE } });
    const transferB = await prisma.transfer.create({ data: { projectId: project.id, type: client_1.TransferType.SOFTWARE_TO_APP } });
    const transferC = await prisma.transfer.create({ data: { projectId: project.id, type: client_1.TransferType.SOFTWARE_TO_APP_PLANNING } });
    console.log('Seed TEST terminé.');
    console.log(JSON.stringify({
        project: { id: project.id, name: project.name },
        project2: { id: project2.id, name: project2.name },
        team: { id: team.id, name: team.name },
        team2: { id: team2.id, name: team2.name },
        pointToSecure: { id: pts.id, pointId: pts.pointId },
        photo: { id: photo.id, mimeType: photo.mimeType },
        routeGeometry: { id: routeGeom.id, name: routeGeom.name },
        safetyEquipmentVehicle: { id: seVehicle.id, actionIds: seVehicle.actions.map((a) => a.id) },
        safetyEquipmentObstacle: { id: seObstacle.id },
        transfers: { transferA: transferA.id, transferB: transferB.id, transferC: transferC.id },
        users: { admin: admin.id, userA: userA.id, userB: userB.id },
    }, null, 2));
}
async function seedTestAndClose() {
    try {
        await seedTest();
    }
    finally {
        await prisma.$disconnect();
    }
}
//# sourceMappingURL=seed-test.js.map