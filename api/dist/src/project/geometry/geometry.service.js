"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GeometryService = class GeometryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(projectId, dto) {
        try {
            const createGeometry = {
                data: {
                    projectId,
                    type: dto.type,
                    name: dto.name,
                },
            };
            if (dto.type === client_1.GeometryType.ROUTE) {
                createGeometry.data.route = {
                    create: {
                        ...dto.route,
                    },
                };
            }
            return await this.prisma.$transaction(async (tx) => {
                const geometry = await tx.geometry.create(createGeometry);
                const createManyPoints = dto.points.map((point) => (tx.point.create({
                    data: {
                        latitude: point.latitude,
                        longitude: point.longitude,
                        type: client_1.PointType.GEOMETRY,
                        geometryPoint: {
                            create: {
                                rank: point.rank,
                                geometryId: geometry.id,
                            },
                        },
                    },
                })));
                await Promise.all(createManyPoints);
                return geometry;
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException(`Impossible de créer la ${dto.type === 'AREA' ? 'zone' : 'route'}`);
        }
    }
    async remove(projectId, id) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.point.deleteMany({
                    where: {
                        geometryPoint: {
                            geometryId: id,
                        },
                    },
                });
                await tx.geometry.delete({
                    where: {
                        projectId,
                        id,
                    },
                });
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de supprimer la géométrie');
        }
    }
    async update(projectId, id, dto) {
        try {
            const geometry = await this.prisma.geometry.findUniqueOrThrow({
                where: { projectId, id },
            });
            await this.prisma.$transaction(async (tx) => {
                await tx.geometry.update({
                    where: { projectId, id },
                    data: {
                        name: dto.name,
                        ...(geometry.type === client_1.GeometryType.ROUTE && dto.route
                            ? {
                                route: {
                                    update: {
                                        startAt: dto.route.startAt,
                                        fasterParticipantSpeedEstimate: dto.route.fasterParticipantSpeedEstimate,
                                        slowerParticipantSpeedEstimate: dto.route.slowerParticipantSpeedEstimate,
                                    },
                                },
                            }
                            : {}),
                    },
                });
                if (dto.points && dto.points.length > 0) {
                    const existingLinks = await tx.geometryPoint.findMany({
                        where: { geometryId: id },
                        select: { pointId: true },
                    });
                    const existingPointIds = existingLinks.map((l) => l.pointId);
                    await tx.geometryPoint.deleteMany({
                        where: { geometryId: id },
                    });
                    if (existingPointIds.length > 0) {
                        await tx.point.deleteMany({
                            where: { id: { in: existingPointIds } },
                        });
                    }
                    await Promise.all(dto.points.map((p) => tx.point.create({
                        data: {
                            latitude: p.latitude,
                            longitude: p.longitude,
                            type: client_1.PointType.GEOMETRY,
                            geometryPoint: {
                                create: {
                                    geometryId: id,
                                    rank: p.rank,
                                },
                            },
                        },
                    })));
                }
            });
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException("Impossible de mettre à jour la géométrie");
        }
    }
    async findAll(projectId) {
        try {
            return this.prisma.geometry.findMany({
                where: {
                    projectId
                },
                include: {
                    geometryPoints: {
                        include: {
                            point: true,
                        },
                    },
                    route: true,
                },
                orderBy: {
                    createdAt: 'asc'
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de récupérer les géométries');
        }
    }
    async findOne(projectId, id) {
        try {
            const geometry = await this.prisma.geometry.findUnique({
                where: {
                    projectId,
                    id,
                },
                include: {
                    geometryPoints: {
                        include: {
                            point: true,
                        },
                    },
                    route: true,
                },
            });
            if (!geometry) {
                throw new common_1.NotFoundException('Géométrie non trouvée');
            }
            return geometry;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Impossible de récupérer la géométrie');
        }
    }
};
exports.GeometryService = GeometryService;
exports.GeometryService = GeometryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GeometryService);
//# sourceMappingURL=geometry.service.js.map