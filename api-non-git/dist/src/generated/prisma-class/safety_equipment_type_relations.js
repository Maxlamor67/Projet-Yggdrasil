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
exports.SafetyEquipmentTypeRelations = void 0;
const point_to_secure_1 = require("./point_to_secure");
const safety_equipment_type_length_1 = require("./safety_equipment_type_length");
const swagger_1 = require("@nestjs/swagger");
class SafetyEquipmentTypeRelations {
}
exports.SafetyEquipmentTypeRelations = SafetyEquipmentTypeRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => point_to_secure_1.PointToSecure }),
    __metadata("design:type", Array)
], SafetyEquipmentTypeRelations.prototype, "pointsToSecure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => safety_equipment_type_length_1.SafetyEquipmentTypeLength }),
    __metadata("design:type", Array)
], SafetyEquipmentTypeRelations.prototype, "lengths", void 0);
//# sourceMappingURL=safety_equipment_type_relations.js.map