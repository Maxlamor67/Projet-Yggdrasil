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
exports.ActionController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const action_service_1 = require("./action.service");
const update_action_dto_1 = require("./dto/update-action.dto");
const swagger_1 = require("@nestjs/swagger");
let ActionController = class ActionController {
    constructor(actionService) {
        this.actionService = actionService;
    }
    update(projectId, safetyEquipmentId, id, updateActionDto) {
        return this.actionService.update(projectId, safetyEquipmentId, id, updateActionDto);
    }
};
exports.ActionController = ActionController;
__decorate([
    openapi.ApiOperation({ summary: "Met \u00E0 jour une action sp\u00E9cifique d'un \u00E9quipement de s\u00E9curit\u00E9." }),
    (0, swagger_1.ApiNoContentResponse)(),
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)("projectId")),
    __param(1, (0, common_1.Param)("safetyEquipmentId")),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_action_dto_1.UpdateActionDto]),
    __metadata("design:returntype", void 0)
], ActionController.prototype, "update", null);
exports.ActionController = ActionController = __decorate([
    (0, common_1.Controller)('projects/:projectId/safety-equipment/:safetyEquipmentId/actions'),
    __metadata("design:paramtypes", [action_service_1.ActionService])
], ActionController);
//# sourceMappingURL=action.controller.js.map