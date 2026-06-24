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
exports.SafetyEquipmentTypeLengthRelations = void 0;
const safety_equipment_type_1 = require("./safety_equipment_type");
const safety_equipment_1 = require("./safety_equipment");
const swagger_1 = require("@nestjs/swagger");
class SafetyEquipmentTypeLengthRelations {
}
exports.SafetyEquipmentTypeLengthRelations = SafetyEquipmentTypeLengthRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => safety_equipment_type_1.SafetyEquipmentType }),
    __metadata("design:type", safety_equipment_type_1.SafetyEquipmentType)
], SafetyEquipmentTypeLengthRelations.prototype, "safetyEquipmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => safety_equipment_1.SafetyEquipment }),
    __metadata("design:type", Array)
], SafetyEquipmentTypeLengthRelations.prototype, "safetyEquipments", void 0);
//# sourceMappingURL=safety_equipment_type_length_relations.js.map