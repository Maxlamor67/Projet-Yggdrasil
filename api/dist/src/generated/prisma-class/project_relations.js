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
exports.ProjectRelations = void 0;
const point_to_secure_1 = require("./point_to_secure");
const geometry_1 = require("./geometry");
const team_1 = require("./team");
const transfer_1 = require("./transfer");
const safety_equipment_1 = require("./safety_equipment");
const attention_point_1 = require("./attention_point");
const swagger_1 = require("@nestjs/swagger");
class ProjectRelations {
}
exports.ProjectRelations = ProjectRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => point_to_secure_1.PointToSecure }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "pointsToSecure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => geometry_1.Geometry }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "geometries", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => team_1.Team }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "teams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => transfer_1.Transfer }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "transfers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => safety_equipment_1.SafetyEquipment }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "safetyEquipments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => attention_point_1.AttentionPoint }),
    __metadata("design:type", Array)
], ProjectRelations.prototype, "attentionPoints", void 0);
//# sourceMappingURL=project_relations.js.map