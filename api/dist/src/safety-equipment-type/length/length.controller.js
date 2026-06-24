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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LengthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const length_service_1 = require("./length.service");
const create_length_dto_1 = require("./dto/create-length.dto");
const update_length_dto_1 = require("./dto/update-length.dto");
const swagger_1 = require("@nestjs/swagger");
const safety_equipment_type_length_1 = require("../../generated/prisma-class/safety_equipment_type_length");
let LengthController = class LengthController {
    constructor(lengthService) {
        this.lengthService = lengthService;
    }
    create(safetyEquipmentTypeId, createLengthDto) {
        return this.lengthService.create(safetyEquipmentTypeId, createLengthDto);
    }
    update(safetyEquipmentTypeId, id, updateLengthDto) {
        return this.lengthService.update(safetyEquipmentTypeId, id, updateLengthDto);
    }
    remove(safetyEquipmentTypeId, id) {
        return this.lengthService.remove(safetyEquipmentTypeId, id);
    }
};
exports.LengthController = LengthController;
__decorate([
    openapi.ApiOperation({ summary: "Cr\u00E9e une nouvelle longueur pour un type d'\u00E9quipement de s\u00E9curit\u00E9." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => safety_equipment_type_length_1.SafetyEquipmentTypeLength,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('safetyEquipmentTypeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_length_dto_1.CreateLengthDto]),
    __metadata("design:returntype", void 0)
], LengthController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "Met \u00E0 jour une longueur existante d'un type d'\u00E9quipement de s\u00E9curit\u00E9." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('safetyEquipmentTypeId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_length_dto_1.UpdateLengthDto]),
    __metadata("design:returntype", void 0)
], LengthController.prototype, "update", null);
__decorate([
    openapi.ApiOperation({ summary: "Supprime une longueur d'un type d'\u00E9quipement de s\u00E9curit\u00E9." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('safetyEquipmentTypeId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LengthController.prototype, "remove", null);
exports.LengthController = LengthController = __decorate([
    (0, common_1.Controller)('safety-equipment-types/:safetyEquipmentTypeId/lengths'),
    __metadata("design:paramtypes", [length_service_1.LengthService])
], LengthController);
//# sourceMappingURL=length.controller.js.map