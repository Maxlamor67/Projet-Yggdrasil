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
exports.TeamController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const create_team_dto_1 = require("./dto/create-team.dto");
const update_team_dto_1 = require("./dto/update-team.dto");
const swagger_1 = require("@nestjs/swagger");
const team_1 = require("../../generated/prisma-class/team");
const responses_1 = require("../../utils/types/responses");
const transfer_1 = require("../../utils/types/transfer");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    create(projectId, createTeamDto) {
        return this.teamService.create(projectId, createTeamDto);
    }
    findAll(projectId) {
        return this.teamService.findAll(projectId);
    }
    findOne(projectId, id) {
        return this.teamService.findOne(projectId, id);
    }
    update(projectId, id, updateTeamDto) {
        return this.teamService.update(projectId, id, updateTeamDto);
    }
    remove(projectId, id) {
        return this.teamService.remove(projectId, id);
    }
    findOnePlanning(projectId, id) {
        return this.teamService.findOnePlanning(projectId, id);
    }
};
exports.TeamController = TeamController;
__decorate([
    openapi.ApiOperation({ summary: "Cr\u00E9e une nouvelle \u00E9quipe pour un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiCreatedResponse)({
        type: () => team_1.Team,
    }),
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "create", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re toutes les \u00E9quipes d'un projet sp\u00E9cifique." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => team_1.Team,
        isArray: true,
    }),
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Param)("projectId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findAll", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re une \u00E9quipe sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => responses_1.GetTeamResponse,
    }),
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: Object }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findOne", null);
__decorate([
    openapi.ApiOperation({ summary: "Met \u00E0 jour une \u00E9quipe sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_team_dto_1.UpdateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "update", null);
__decorate([
    openapi.ApiOperation({ summary: "Supprime une \u00E9quipe sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "remove", null);
__decorate([
    openapi.ApiOperation({ summary: "R\u00E9cup\u00E8re le planning d'une \u00E9quipe sp\u00E9cifique d'un projet." }),
    (0, swagger_1.ApiOkResponse)({
        type: () => transfer_1.ActionsAndSafetyEquipmentTypeLength,
        isArray: true,
    }),
    (0, common_1.Get)(':id/planning'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK, type: [Object] }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findOnePlanning", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)('projects/:projectId/teams'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map