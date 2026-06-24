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
exports.SafetyEquipmentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const safety_equipment_service_1 = require("./safety-equipment.service");
const create_safety_equipment_dto_1 = require("./dto/create-safety-equipment.dto");
const update_safety_equipment_dto_1 = require("./dto/update-safety-equipment.dto");
const swagger_1 = require("@nestjs/swagger");
const safety_equipment_1 = require("../../generated/prisma-class/safety_equipment");
const responses_1 = require("../../utils/types/responses");
let SafetyEquipmentController = class SafetyEquipmentController {
    constructor(safetyEquipmentService) {
        this.safetyEquipmentService = safetyEquipmentService;
    }
    create(projectId, dto) {
        return this.safetyEquipmentService.create(projectId, dto);
    }
    remove(projectId, id) {
        return this.safetyEquipmentService.remove(projectId, id);
    }
    findAll(projectId) {
        return this.safetyEquipmentService.findAll(projectId);
    }
    findOne(projectId, id) {
        return this.safetyEquipmentService.findOne(projectId, id);
    }
    update(projectId, id, dto) {
        return this.safetyEquipmentService.update(projectId, id, dto);
    }
};
exports.SafetyEquipmentController = SafetyEquipmentController;
__decorate([
    openapi.ApiOperation({ summary: "Cr\u00E9e un nouvel \u00E9quipement de s\u00E9curit\u00E9 pour un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => safety_equipment_1.SafetyEquipment,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_safety_equipment_dto_1.CreateSafetyEquipmentDto]),
    __metadata("design:returntype", void 0)
], SafetyEquipmentController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "Supprime un \u00E9quipement de s\u00E9curit\u00E9 sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SafetyEquipmentController.prototype, "remove", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re tous les \u00E9quipements de s\u00E9curit\u00E9 d'un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetAllSafetyEquipmentsResponse,
        isArray: true,
    }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Param)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SafetyEquipmentController.prototype, "findAll", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re un \u00E9quipement de s\u00E9curit\u00E9 sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetSafetyEquipmentResponse,
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SafetyEquipmentController.prototype, "findOne", null);
__decorate([
    openapi.ApiOperation({ summary: "Met \u00E0 jour un \u00E9quipement de s\u00E9curit\u00E9 sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Put)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_safety_equipment_dto_1.UpdateSafetyEquipmentDto]),
    __metadata("design:returntype", void 0)
], SafetyEquipmentController.prototype, "update", null);
exports.SafetyEquipmentController = SafetyEquipmentController = __decorate([
    (0, common_1.Controller)('projects/:projectId/safety-equipment'),
    __metadata("design:paramtypes", [safety_equipment_service_1.SafetyEquipmentService])
], SafetyEquipmentController);
//# sourceMappingURL=safety-equipment.controller.js.map