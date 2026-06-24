import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {Prisma, TransferType} from "@prisma/client";

@Injectable()
export class TeamService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async create(projectId: string, createTeamDto: CreateTeamDto) {
        try {
            return this.prisma.team.create({
                data: {
                    projectId,
                    name: createTeamDto.name,
                    users: {
                        connect: createTeamDto.members.map(member => (
                            {
                                id: member
                            }
                        )),
                    }
                }
            });
        } catch (_) {
            throw new InternalServerErrorException('Impossible de créer l\'équipe');
        }
    }

    async findAll(projectId: string) {
        try {
            return this.prisma.team.findMany({
                where: {
                    projectId,
                }
            });
        } catch (_) {
            throw new InternalServerErrorException('Impossible de récupérer les équipes');
        }
    }

    async findOne(projectId: string, id: string) {
        try {
            const team = await this.prisma.team.findUnique({
                where: {
                    id,
                    projectId,
                },
                include: {
                    users: true,
                }
            });
            
            if (!team) {
                throw new NotFoundException('Équipe non trouvée');
            }
            
            return team;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Impossible de récupérer l\'équipe');
        }
    }

    async update(projectId: string, id: string, updateTeamDto: UpdateTeamDto) {
        try {
            await this.prisma.team.update({
                where: {
                    id,
                    projectId,
                },
                data: {
                    name: updateTeamDto.name,
                    users: {
                        disconnect: updateTeamDto.removeMembers.map(member => (
                            {
                                id: member
                            }
                        )),
                        connect: updateTeamDto.addMembers.map(member => (
                            {
                                id: member
                            }
                        )),
                    }
                }
            });
        } catch (_) {
            throw new InternalServerErrorException('Impossible de mettre à jour l\'équipe');
        }
    }

    async remove(projectId: string, id: string) {
        try {
            await this.prisma.team.delete({
                where: {
                    id,
                    projectId,
                }
            });
        } catch (_) {
            throw new InternalServerErrorException('Impossible de supprimer l\'équipe');
        }
    }

    async findOnePlanning(projectId: string, id: string) {
        try {
            const project = await this.prisma.project.findUniqueOrThrow({
                where: {
                    id: projectId,
                    teams: {
                        some: {
                            id,
                        },
                    },
                },
                select: {
                    safetyEquipments: {
                        where: {
                            actions: {
                                some: {
                                    teamId: id,
                                }
                            }
                        },
                        include: {
                            actions: {
                                where: {
                                    teamId: id,
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
            });

            return project.safetyEquipments;
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Planning non trouvé pour cette équipe');
            }
            throw new InternalServerErrorException('Une erreur est survenue lors de la récupération du planning');
        }
    }
}
