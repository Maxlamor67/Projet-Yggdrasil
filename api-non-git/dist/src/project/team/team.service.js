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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TeamService = class TeamService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(projectId, createTeamDto) {
        try {
            return this.prisma.team.create({
                data: {
                    projectId,
                    name: createTeamDto.name,
                    users: {
                        connect: createTeamDto.members.map(member => ({
                            id: member
                        })),
                    }
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de créer l\'équipe');
        }
    }
    async findAll(projectId) {
        try {
            return this.prisma.team.findMany({
                where: {
                    projectId,
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de récupérer les équipes');
        }
    }
    async findOne(projectId, id) {
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
                throw new common_1.NotFoundException('Équipe non trouvée');
            }
            return team;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Impossible de récupérer l\'équipe');
        }
    }
    async update(projectId, id, updateTeamDto) {
        try {
            await this.prisma.team.update({
                where: {
                    id,
                    projectId,
                },
                data: {
                    name: updateTeamDto.name,
                    users: {
                        disconnect: updateTeamDto.removeMembers.map(member => ({
                            id: member
                        })),
                        connect: updateTeamDto.addMembers.map(member => ({
                            id: member
                        })),
                    }
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de mettre à jour l\'équipe');
        }
    }
    async remove(projectId, id) {
        try {
            await this.prisma.team.delete({
                where: {
                    id,
                    projectId,
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de supprimer l\'équipe');
        }
    }
    async findOnePlanning(projectId, id) {
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException('Planning non trouvé pour cette équipe');
            }
            throw new common_1.InternalServerErrorException('Une erreur est survenue lors de la récupération du planning');
        }
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map