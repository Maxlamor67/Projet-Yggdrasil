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
exports.SafetyEquipmentRelations = void 0;
const project_1 = require("./project");
const safety_equipment_type_length_1 = require("./safety_equipment_type_length");
const action_1 = require("./action");
const safety_equipment_point_1 = require("./safety_equipment_point");
const swagger_1 = require("@nestjs/swagger");
class SafetyEquipmentRelations {
}
exports.SafetyEquipmentRelations = SafetyEquipmentRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => project_1.Project }),
    __metadata("design:type", project_1.Project)
], SafetyEquipmentRelations.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => safety_equipment_type_length_1.SafetyEquipmentTypeLength }),
    __metadata("design:type", safety_equipment_type_length_1.SafetyEquipmentTypeLength)
], SafetyEquipmentRelations.prototype, "safetyEquipmentTypeLength", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => action_1.Action }),
    __metadata("design:type", Array)
], SafetyEquipmentRelations.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => safety_equipment_point_1.SafetyEquipmentPoint }),
    __metadata("design:type", Array)
], SafetyEquipmentRelations.prototype, "safetyEquipmentPoints", void 0);
//# sourceMappingURL=safety_equipment_relations.js.map