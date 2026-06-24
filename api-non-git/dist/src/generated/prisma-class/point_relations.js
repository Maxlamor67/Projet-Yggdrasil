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
exports.PointRelations = void 0;
const geometry_point_1 = require("./geometry_point");
const safety_equipment_point_1 = require("./safety_equipment_point");
const point_to_secure_1 = require("./point_to_secure");
const attention_point_1 = require("./attention_point");
const swagger_1 = require("@nestjs/swagger");
class PointRelations {
}
exports.PointRelations = PointRelations;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => geometry_point_1.GeometryPoint }),
    __metadata("design:type", geometry_point_1.GeometryPoint)
], PointRelations.prototype, "geometryPoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => safety_equipment_point_1.SafetyEquipmentPoint }),
    __metadata("design:type", safety_equipment_point_1.SafetyEquipmentPoint)
], PointRelations.prototype, "safetyEquipmentPoint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => point_to_secure_1.PointToSecure }),
    __metadata("design:type", point_to_secure_1.PointToSecure)
], PointRelations.prototype, "pointToSecure", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => attention_point_1.AttentionPoint }),
    __metadata("design:type", attention_point_1.AttentionPoint)
], PointRelations.prototype, "attentionPoint", void 0);
//# sourceMappingURL=point_relations.js.map