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
exports.LengthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LengthService = class LengthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(safetyEquipmentTypeId, createLengthDto) {
        try {
            return await this.prisma.safetyEquipmentTypeLength.create({
                data: {
                    safetyEquipmentTypeId,
                    ...createLengthDto,
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de créer la longueur de l\'équipement de sécurité');
        }
    }
    async update(safetyEquipmentTypeId, id, updateLengthDto) {
        try {
            await this.prisma.safetyEquipmentTypeLength.update({
                where: {
                    id,
                    safetyEquipmentTypeId,
                },
                data: updateLengthDto,
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de mettre à jour la longueur de l\'équipement de sécurité');
        }
    }
    async remove(safetyEquipmentTypeId, id) {
        try {
            await this.prisma.safetyEquipmentTypeLength.delete({
                where: {
                    id,
                    safetyEquipmentTypeId,
                    safetyEquipmentType: {
                        lengths: {
                            some: {
                                id: {
                                    not: id,
                                },
                            },
                        },
                    },
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Une longueur de type d\'équipement de sécurité liée à des équipements de sécurité ne peut pas être supprimée');
        }
    }
};
exports.LengthService = LengthService;
exports.LengthService = LengthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LengthService);
//# sourceMappingURL=length.service.js.map