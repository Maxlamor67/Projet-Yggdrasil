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
exports.SafetyEquipments = exports.ActionsAndSafetyEquipmentTypeLength = exports.ProjectAndTeams = exports.ProjectDetailsAndSafetyEquipmentTypes = exports.Geometries = exports.GeometryPoints = void 0;
const swagger_1 = require("@nestjs/swagger");
const geometry_point_1 = require("../../generated/prisma-class/geometry_point");
const geometry_point_relations_1 = require("../../generated/prisma-class/geometry_point_relations");
const geometry_1 = require("../../generated/prisma-class/geometry");
const project_1 = require("../../generated/prisma-class/project");
const safety_equipment_type_1 = require("../../generated/prisma-class/safety_equipment_type");
const team_1 = require("../../generated/prisma-class/team");
const safety_equipment_type_length_1 = require("../../generated/prisma-class/safety_equipment_type_length");
const safety_equipment_type_length_relations_1 = require("../../generated/prisma-class/safety_equipment_type_length_relations");
const action_1 = require("../../generated/prisma-class/action");
const safety_equipment_1 = require("../../generated/prisma-class/safety_equipment");
const safety_equipment_point_1 = require("../../generated/prisma-class/safety_equipment_point");
const safety_equipment_point_relations_1 = require("../../generated/prisma-class/safety_equipment_point_relations");
class GeometryPoints {
}
exports.GeometryPoints = GeometryPoints;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => (0, swagger_1.IntersectionType)(geometry_point_1.GeometryPoint, (0, swagger_1.PickType)(geometry_point_relations_1.GeometryPointRelations, ['point'])) }),
    __metadata("design:type", Array)
], GeometryPoints.prototype, "geometryPoints", void 0);
class Geometries {
}
exports.Geometries = Geometries;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => (0, swagger_1.IntersectionType)(geometry_1.Geometry, GeometryPoints) }),
    __metadata("design:type", Array)
], Geometries.prototype, "geometries", void 0);
class ProjectDetailsAndSafetyEquipmentTypes {
}
exports.ProjectDetailsAndSafetyEquipmentTypes = ProjectDetailsAndSafetyEquipmentTypes;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => (0, swagger_1.IntersectionType)(project_1.Project, Geometries) }),
    __metadata("design:type", Object)
], ProjectDetailsAndSafetyEquipmentTypes.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => safety_equipment_type_1.SafetyEquipmentType }),
    __metadata("design:type", safety_equipment_type_1.SafetyEquipmentType)
], ProjectDetailsAndSafetyEquipmentTypes.prototype, "safetyEquipmentTypes", void 0);
class ProjectAndTeams {
}
exports.ProjectAndTeams = ProjectAndTeams;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => (0, swagger_1.OmitType)(team_1.Team, ['projectId', 'createdAt', 'updatedAt']), required: false }),
    __metadata("design:type", Array)
], ProjectAndTeams.prototype, "teams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => ProjectDetailsAndSafetyEquipmentTypes, required: false }),
    __metadata("design:type", ProjectDetailsAndSafetyEquipmentTypes)
], ProjectAndTeams.prototype, "project", void 0);
class ActionsAndSafetyEquipmentTypeLength extends safety_equipment_1.SafetyEquipment {
}
exports.ActionsAndSafetyEquipmentTypeLength = ActionsAndSafetyEquipmentTypeLength;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => action_1.Action }),
    __metadata("design:type", Array)
], ActionsAndSafetyEquipmentTypeLength.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => (0, swagger_1.IntersectionType)(safety_equipment_type_length_1.SafetyEquipmentTypeLength, (0, swagger_1.PickType)(safety_equipment_type_length_relations_1.SafetyEquipmentTypeLengthRelations, ['safetyEquipmentType'])) }),
    __metadata("design:type", Object)
], ActionsAndSafetyEquipmentTypeLength.prototype, "safetyEquipmentTypeLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => (0, swagger_1.IntersectionType)(safety_equipment_point_1.SafetyEquipmentPoint, (0, swagger_1.PickType)(safety_equipment_point_relations_1.SafetyEquipmentPointRelations, ['point'])) }),
    __metadata("design:type", Array)
], ActionsAndSafetyEquipmentTypeLength.prototype, "safetyEquipmentPoints", void 0);
class SafetyEquipments {
}
exports.SafetyEquipments = SafetyEquipments;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => ActionsAndSafetyEquipmentTypeLength }),
    __metadata("design:type", Array)
], SafetyEquipments.prototype, "safetyEquipments", void 0);
//# sourceMappingURL=transfer.js.map