import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {CreateTransferDto} from "./dto/create-transfer.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {AppService} from "../../app.service";
import {PointType, Prisma, TransferType} from "@prisma/client";
import {CreatePointToSecureDto} from "../point-to-secure/dto/create-point-to-secure.dto";

@Injectable()
export class TransferService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly appService: AppService,
    ) {}

    async importData(projectId: string, id: string, dto: { pointToSecure: Omit<CreatePointToSecureDto, 'isTreated'>, photos: Express.Multer.File[] }[]) {
        try {
            const transfer = await this.prisma.transfer.findUniqueOrThrow({
                where: {
                    id,
                    type: TransferType.APP_TO_SOFTWARE,
                    project: {
                        id: projectId,
                    },
                    createdAt: {
                        gte: new Date(Date.now() - 5 * 60 * 1000),
                    },
                },
            });

            const queries = dto.map((data) => {
                const createPointToSecure: Prisma.PointToSecureCreateArgs = {
                    data: {
                        comment: data.pointToSecure.comment,
                        project: {
                            connect: {
                                id: transfer.projectId,
                            },
                        },
                        point: {
                            create: {
                                ...data.pointToSecure.point,
                                type: PointType.POINT_TO_SECURE,
                            },
                        },
                        photos: {
                            create: data.photos.map((photo) => ({
                                data: photo.buffer as Uint8Array<ArrayBuffer>,
                                mimeType: photo.mimetype
                            })),
                        },
                    },
                };

                if (data.pointToSecure.safetyEquipmentTypeId) {
                    createPointToSecure.data.safetyEquipmentType = {
                        connect: {
                            id: data.pointToSecure.safetyEquipmentTypeId,
                        },
                    };
                }
                return this.prisma.pointToSecure.create(createPointToSecure);
            });
            await this.prisma.$transaction(queries);
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ForbiddenException('Vous n\'avez pas la permission d\'importer des données.');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de l\'importation des données.');
        }
    }

    private async exportData(projectId: string) {
        try {
            const details = await this.prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                include: {
                    geometries: {
                        include: {
                            geometryPoints: {
                                include: {
                                    point: true,
                                },
                            },
                        },
                    },
                },
            });
            const safetyEquipmentTypes = await this.prisma.safetyEquipmentType.findMany();

            return {
                details,
                safetyEquipmentTypes,
            };
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Projet non trouvé.');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de l\'exportation des données.');
        }
    }

    private async requestExportPlanningData(projectId: string) {
        try {
            return await this.prisma.team.findMany({
                where: {
                    projectId,
                },
                select: {
                    id: true,
                    name: true,
                }
            });
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Projet non trouvé.');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de l\'exportation des données.');
        }
    }

    async exportPlanningData(projectId: string, id: string, teamId: string) {
        try {
            const transfer = await this.prisma.transfer.findUniqueOrThrow({
                where: {
                    id,
                    type: TransferType.SOFTWARE_TO_APP_PLANNING,
                    project: {
                        id: projectId,
                        teams: {
                            some: {
                                id: teamId,
                            },
                        },
                    },
                    createdAt: {
                        gte: new Date(Date.now() - 5 * 60 * 1000),
                    },
                },
                include: {
                    project: {
                        include: {
                            safetyEquipments: {
                                where: {
                                    actions: {
                                        some: {
                                            teamId,
                                        }
                                    }
                                },
                                include: {
                                    actions: {
                                        where: {
                                            teamId,
                                        },
                                    },
                                    safetyEquipmentTypeLength: {
                                        include: {
                                            safetyEquipmentType: true,
                                        },
                                    },
                                    safetyEquipmentPoints: {
                                        include: {
                                            point: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return transfer.project;
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Projet non trouvé.');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de l\'exportation des données.');
        }
    }

    async setupTransfer(projectId: string, setupTransferDto: CreateTransferDto) {
        try {
            const project = await this.prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                },
                include: {
                    teams: {
                        include: {
                            actions: true,
                        }
                    }
                }
            });
            if (project.teams.length === 0 && (setupTransferDto.type === TransferType.SOFTWARE_TO_APP_PLANNING)) {
                throw new BadRequestException('Impossible de créer un transfert de planning pour un projet sans équipe.');
            } else if (project.teams.every(team => team.actions.length === 0) && (setupTransferDto.type === TransferType.SOFTWARE_TO_APP_PLANNING)) {
                throw new BadRequestException('Impossible de créer un transfert de planning pour un projet sans action assignée à une équipe.');
            }

            const transfer = await this.prisma.transfer.create({
                data: {
                    projectId,
                    ...setupTransferDto,
                },
            });
            const ip = this.appService.getIpAddress();

            return {
                projectId: transfer.type === TransferType.SOFTWARE_TO_APP || transfer.type === TransferType.SOFTWARE_TO_APP_PLANNING ? projectId : undefined,
                transferId: transfer.id,
                ...ip,
            }
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Projet non trouvé.');
            }
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de la création du transfert.');
        }
    }

    async joinTransfer(projectId: string, id: string) {
        try {
            const transfer = await this.prisma.transfer.findUniqueOrThrow({
                where: {
                    id,
                    project: {
                        id: projectId,
                    },
                    createdAt: {
                        gte: new Date(Date.now() - 5 * 60 * 1000),
                    },
                },
            });

            let data: object = undefined;
            switch (transfer.type) {
                case TransferType.SOFTWARE_TO_APP:
                    data = {
                        project: await this.exportData(transfer.projectId)
                    };
                    break;
                case TransferType.SOFTWARE_TO_APP_PLANNING:
                    data = {
                        teams: await this.requestExportPlanningData(transfer.projectId),
                    };
                    break;
            }

            return {
                type: transfer.type,
                data,
            }
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ForbiddenException('Vous n\'avez pas la permission de rejoindre ce transfert.');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de la tentative de rejoindre le transfert.');
        }
    }
}
