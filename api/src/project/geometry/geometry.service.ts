import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGeometryDto } from './dto/create-geometry.dto';
import { UpdateGeometryDto } from './dto/update-geometry.dto';
import {GeometryType, PointType, Prisma} from '@prisma/client';

@Injectable()
export class GeometryService {
    constructor(private prisma: PrismaService) {}

    async create(projectId: string, dto: CreateGeometryDto) {
        try {
            const createGeometry: Prisma.GeometryCreateArgs = {
                data: {
                    projectId,
                    type: dto.type,
                    name: dto.name,
                },
            };

            if (dto.type === GeometryType.ROUTE) {
                createGeometry.data.route = {
                    create: {
                        ...dto.route,
                    },
                };
            }

            return await this.prisma.$transaction(async (tx) => {
                const geometry = await tx.geometry.create(createGeometry);
                const createManyPoints = dto.points.map((point) => (
                    tx.point.create({
                        data: {
                            latitude: point.latitude,
                            longitude: point.longitude,
                            type: PointType.GEOMETRY,
                            geometryPoint: {
                                create: {
                                    rank: point.rank,
                                    geometryId: geometry.id,
                                },
                            },
                        },
                    })
                ));
                await Promise.all(createManyPoints);

                return geometry;
            });
        } catch (_) {
            throw new InternalServerErrorException(`Impossible de créer la ${dto.type === 'AREA' ? 'zone' : 'route'}`);
        }
    }

    async remove(projectId: string, id: string) {
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
        } catch (_) {
            throw new InternalServerErrorException('Impossible de supprimer la géométrie');
        }
    }

    async update(projectId: string, id: string, dto: UpdateGeometryDto) {
    try {
        const geometry = await this.prisma.geometry.findUniqueOrThrow({
        where: { projectId, id },
        });

        await this.prisma.$transaction(async (tx) => {
        await tx.geometry.update({
            where: { projectId, id },
            data: {
            name: dto.name,
            ...(geometry.type === GeometryType.ROUTE && dto.route
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


            await Promise.all(
            dto.points.map((p) =>
                tx.point.create({
                data: {
                    latitude: p.latitude,
                    longitude: p.longitude,
                    type: PointType.GEOMETRY,
                    geometryPoint: {
                    create: {
                        geometryId: id,
                        rank: p.rank,
                    },
                    },
                },
                }),
            ),
            );
        }
        });
        } catch (e) {
            console.error(e);
            throw new InternalServerErrorException("Impossible de mettre à jour la géométrie");
        }
    }


    async findAll(projectId: string) {
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
        } catch (_) {
            throw new InternalServerErrorException('Impossible de récupérer les géométries');
        }
    }

    async findOne(projectId: string, id: string) {
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
                throw new NotFoundException('Géométrie non trouvée');
            }
            
            return geometry;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Impossible de récupérer la géométrie');
        }
    }
}
