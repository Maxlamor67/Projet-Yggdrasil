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
exports.TransferController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transfer_service_1 = require("./transfer.service");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const import_data_dto_1 = require("./dto/import-data.dto");
const nestjs_better_auth_1 = require("@thallesp/nestjs-better-auth");
const platform_express_1 = require("@nestjs/platform-express");
const class_transformer_1 = require("class-transformer");
const responses_1 = require("../../utils/types/responses");
const base64_repair_1 = require("./interceptors/base64-repair");
let TransferController = class TransferController {
    constructor(transferService) {
        this.transferService = transferService;
    }
    create(projectId, setupTransferDto) {
        return this.transferService.setupTransfer(projectId, setupTransferDto);
    }
    joinTransfer(projectId, id) {
        return this.transferService.joinTransfer(projectId, id);
    }
    async importData(projectId, id, dto, rawPhotos) {
        const pipe = new common_1.ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
        const data = (0, class_transformer_1.plainToInstance)(import_data_dto_1.ImportDataDto, JSON.parse(dto.data));
        const newDto = await pipe.transform(data, {
            type: 'body',
            metatype: import_data_dto_1.ImportDataDto,
        });
        const result = newDto.pointsToSecure.map((pointToSecure) => {
            const photos = rawPhotos.filter(f => f.originalname.startsWith(`file_${pointToSecure.index}_`));
            return {
                photos,
                pointToSecure,
            };
        });
        return this.transferService.importData(projectId, id, result);
    }
    exportPlanningData(projectId, id, teamId) {
        return this.transferService.exportPlanningData(projectId, id, teamId);
    }
};
exports.TransferController = TransferController;
__decorate([
    openapi.ApiOperation({ summary: "Configure un nouveau transfert pour un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => responses_1.CreateTransferResponse,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "Permet de rejoindre un transfert existant.\nCet endpoint est accessible sans authentification." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetTransferResponse,
    }),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Get)(":id"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "joinTransfer", null);
__decorate([
    openapi.ApiOperation({ summary: "Importe des donn\u00E9es dans un transfert, incluant des points \u00E0 s\u00E9curiser et leurs photos associ\u00E9es.\nCet endpoint accepte des fichiers multipart (photos) et valide leur format (PNG, JPEG, JPG).\nLes photos sont associ\u00E9es aux points \u00E0 s\u00E9curiser via un pr\u00E9fixe dans leur nom de fichier.\nAccessible sans authentification." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    description: 'JSON stringifié contenant les métadonnées'
                },
                rawPhotos: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
            required: ['data', 'rawPhotos'],
        },
    }),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Post)(':id/import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('photos'), base64_repair_1.Base64RepairInterceptor),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ })
        .build({ fileIsRequired: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, import_data_dto_1.ImportRawDataDto,
        Array]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "importData", null);
__decorate([
    openapi.ApiOperation({ summary: "Exporte les donn\u00E9es de planification d'un transfert sp\u00E9cifique.\nAccessible sans authentification." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetTransferPlanningResponse,
    }),
    (0, nestjs_better_auth_1.AllowAnonymous)(),
    (0, common_1.Post)(":id/export-planning/:teamId"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TransferController.prototype, "exportPlanningData", null);
exports.TransferController = TransferController = __decorate([
    (0, common_1.Controller)('projects/:projectId/transfers'),
    __metadata("design:paramtypes", [transfer_service_1.TransferService])
], TransferController);
//# sourceMappingURL=transfer.controller.js.map