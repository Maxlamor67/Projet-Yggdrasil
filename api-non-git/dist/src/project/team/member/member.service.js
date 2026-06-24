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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let MemberService = class MemberService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(projectId, teamId, createMemberDto) {
        try {
            const project = await this.prisma.team.update({
                where: {
                    id: teamId,
                    projectId,
                },
                data: {
                    users: {
                        connect: {
                            id: createMemberDto.userId,
                        },
                    },
                },
                select: {
                    users: {
                        where: {
                            id: createMemberDto.userId,
                        },
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                }
            });
            return project.users[0];
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible d\'ajouter le membre à l\'équipe');
        }
    }
    async remove(projectId, teamId, id) {
        try {
            await this.prisma.team.update({
                where: {
                    id: teamId,
                    projectId,
                },
                data: {
                    users: {
                        disconnect: {
                            id
                        },
                    },
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de supprimer le membre de l\'équipe');
        }
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MemberService);
//# sourceMappingURL=member.service.js.map