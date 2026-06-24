"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const point_to_secure_module_1 = require("./point-to-secure/point-to-secure.module");
const geometry_module_1 = require("./geometry/geometry.module");
const team_module_1 = require("./team/team.module");
const transfer_module_1 = require("./transfer/transfer.module");
const safety_equipment_module_1 = require("./safety-equipment/safety-equipment.module");
const attention_point_module_1 = require("./attention-point/attention-point.module");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            point_to_secure_module_1.PointToSecureModule,
            geometry_module_1.GeometryModule,
            team_module_1.TeamModule,
            transfer_module_1.TransferModule,
            safety_equipment_module_1.SafetyEquipmentModule,
            attention_point_module_1.AttentionPointModule,
        ],
        controllers: [project_controller_1.ProjectController],
        providers: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map