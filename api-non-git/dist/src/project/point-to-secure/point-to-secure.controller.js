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
exports.PointToSecureController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const point_to_secure_service_1 = require("./point-to-secure.service");
const create_point_to_secure_dto_1 = require("./dto/create-point-to-secure.dto");
const filter_point_to_secure_dto_1 = require("./dto/filter-point-to-secure.dto");
const update_point_to_secure_dto_1 = require("./dto/update-point-to-secure.dto");
const swagger_1 = require("@nestjs/swagger");
const responses_1 = require("../../utils/types/responses");
const point_to_secure_1 = require("../../generated/prisma-class/point_to_secure");
let PointToSecureController = class PointToSecureController {
    constructor(service) {
        this.service = service;
    }
    create(projectId, dto) {
        return this.service.create(projectId, dto);
    }
    remove(projectId, id) {
        return this.service.remove(projectId, id);
    }
    findAll(projectId, filters) {
        return this.service.findAll(projectId, filters);
    }
    findOne(projectId, id) {
        return this.service.findOne(projectId, id);
    }
    update(projectId, id, dto) {
        return this.service.update(projectId, id, dto);
    }
    async findTile(projectId, id, photoId, res) {
        const photo = await this.service.findOnePhoto(projectId, id, photoId);
        res.setHeader('Content-Length', photo.data.length);
        res.setHeader('Content-Type', photo.mimeType);
        res.send(photo.data);
    }
};
exports.PointToSecureController = PointToSecureController;
__decorate([
    openapi.ApiOperation({ summary: "Cr\u00E9e un nouveau point \u00E0 s\u00E9curiser pour un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => point_to_secure_1.PointToSecure,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_point_to_secure_dto_1.CreatePointToSecureDto]),
    __metadata("design:returntype", void 0)
], PointToSecureController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "Supprime un point \u00E0 s\u00E9curiser sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Delete)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PointToSecureController.prototype, "remove", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re tous les points \u00E0 s\u00E9curiser d'un projet avec filtres optionnels." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetAllPointsToSecureResponse,
        isArray: true,
    }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_point_to_secure_dto_1.FilterPointToSecureDto]),
    __metadata("design:returntype", void 0)
], PointToSecureController.prototype, "findAll", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re un point \u00E0 s\u00E9curiser sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetPointToSecureResponse,
    }),
    (0, common_1.Get)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PointToSecureController.prototype, "findOne", null);
__decorate([
    openapi.ApiOperation({ summary: "Met \u00E0 jour un point \u00E0 s\u00E9curiser sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Put)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_point_to_secure_dto_1.UpdatePointToSecureDto]),
    __metadata("design:returntype", void 0)
], PointToSecureController.prototype, "update", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re une photo associ\u00E9e \u00E0 un point \u00E0 s\u00E9curiser.\nLes photos sont mises en cache pendant 24 heures c\u00F4t\u00E9 client." }),
    (0, common_1.Get)(':id/photos/:photoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'public, max-age=86400'),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("photoId")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PointToSecureController.prototype, "findTile", null);
exports.PointToSecureController = PointToSecureController = __decorate([
    (0, common_1.Controller)('projects/:projectId/points-to-secure'),
    __metadata("design:paramtypes", [point_to_secure_service_1.PointToSecureService])
], PointToSecureController);
//# sourceMappingURL=point-to-secure.controller.js.map