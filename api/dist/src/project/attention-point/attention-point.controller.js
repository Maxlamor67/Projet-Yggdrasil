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
exports.AttentionPointController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const attention_point_service_1 = require("./attention-point.service");
const create_attention_point_dto_1 = require("./dto/create-attention-point.dto");
const swagger_1 = require("@nestjs/swagger");
const attention_point_1 = require("../../generated/prisma-class/attention_point");
const responses_1 = require("../../utils/types/responses");
let AttentionPointController = class AttentionPointController {
    constructor(attentionPointService) {
        this.attentionPointService = attentionPointService;
    }
    create(projectId, createAttentionPointDto) {
        return this.attentionPointService.create(projectId, createAttentionPointDto);
    }
    findAll(projectId) {
        return this.attentionPointService.findAll(projectId);
    }
    findOne(projectId, id) {
        return this.attentionPointService.findOne(projectId, id);
    }
    remove(projectId, id) {
        return this.attentionPointService.remove(projectId, id);
    }
};
exports.AttentionPointController = AttentionPointController;
__decorate([
    openapi.ApiOperation({ summary: "Cr\u00E9e un nouveau point d'attention pour un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => attention_point_1.AttentionPoint,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_attention_point_dto_1.CreateAttentionPointDto]),
    __metadata("design:returntype", void 0)
], AttentionPointController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re tous les points d'attention d'un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetAttentionPointsResponse,
        isArray: true,
    }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Param)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttentionPointController.prototype, "findAll", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re un point d'attention sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetAttentionPointsResponse,
    }),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttentionPointController.prototype, "findOne", null);
__decorate([
    openapi.ApiOperation({ summary: "Supprime un point d'attention sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttentionPointController.prototype, "remove", null);
exports.AttentionPointController = AttentionPointController = __decorate([
    (0, common_1.Controller)('projects/:projectId/attention-points'),
    __metadata("design:paramtypes", [attention_point_service_1.AttentionPointService])
], AttentionPointController);
//# sourceMappingURL=attention-point.controller.js.map