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
exports.AttentionPointService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AttentionPointService = class AttentionPointService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(projectId, dto) {
        try {
            return await this.prisma.attentionPoint.create({
                data: {
                    project: {
                        connect: {
                            id: projectId,
                        }
                    },
                    ...dto,
                    point: {
                        create: {
                            type: client_1.PointType.ATTENTION_POINT,
                            ...dto.point,
                        }
                    },
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de créer le point d\'attention');
        }
    }
    async remove(projectId, id) {
        try {
            await this.prisma.point.deleteMany({
                where: {
                    attentionPoint: {
                        id,
                        projectId,
                    },
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de supprimer le point d\'attention');
        }
    }
    async findAll(projectId) {
        try {
            return this.prisma.attentionPoint.findMany({
                where: {
                    projectId
                },
                include: {
                    point: true,
                },
                orderBy: {
                    createdAt: 'asc'
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de récupérer les points d\'attention');
        }
    }
    async findOne(projectId, id) {
        try {
            return await this.prisma.attentionPoint.findUniqueOrThrow({
                where: {
                    projectId,
                    id,
                },
                include: {
                    point: true,
                },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new common_1.NotFoundException('Point d\'attention non trouvé');
            }
            throw new common_1.InternalServerErrorException('Impossible de récupérer le point d\'attention');
        }
    }
};
exports.AttentionPointService = AttentionPointService;
exports.AttentionPointService = AttentionPointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttentionPointService);
//# sourceMappingURL=attention-point.service.js.map