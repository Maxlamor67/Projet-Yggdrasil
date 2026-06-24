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
exports.SafetyEquipmentTypeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SafetyEquipmentTypeService = class SafetyEquipmentTypeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSafetyEquipmentTypeDto) {
        try {
            return await this.prisma.safetyEquipmentType.create({
                data: {
                    ...createSafetyEquipmentTypeDto,
                    lengths: {
                        createMany: {
                            data: createSafetyEquipmentTypeDto.lengths,
                        }
                    }
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de créer le type d\'équipement de sécurité');
        }
    }
    async findAll() {
        try {
            return await this.prisma.safetyEquipmentType.findMany({
                include: {
                    lengths: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de récupérer les types d\'équipements de sécurité');
        }
    }
    async update(id, updateSafetyEquipmentTypeDto) {
        try {
            await this.prisma.safetyEquipmentType.update({
                where: {
                    id,
                },
                data: updateSafetyEquipmentTypeDto,
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Impossible de mettre à jour le type d\'équipement de sécurité');
        }
    }
    async remove(id) {
        try {
            await this.prisma.safetyEquipmentType.delete({
                where: {
                    id,
                }
            });
        }
        catch (_) {
            throw new common_1.InternalServerErrorException('Un type d\'équipement de sécurité lié à des équipements ne peut pas être supprimé');
        }
    }
};
exports.SafetyEquipmentTypeService = SafetyEquipmentTypeService;
exports.SafetyEquipmentTypeService = SafetyEquipmentTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SafetyEquipmentTypeService);
//# sourceMappingURL=safety-equipment-type.service.js.map