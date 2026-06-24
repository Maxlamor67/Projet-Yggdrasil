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
exports.SafetyEquipmentType = void 0;
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class SafetyEquipmentType {
}
exports.SafetyEquipmentType = SafetyEquipmentType;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SafetyEquipmentType.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SafetyEquipmentType.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.SafetyEquipmentTypeModel,
        enumName: 'SafetyEquipmentTypeModel',
    }),
    __metadata("design:type", String)
], SafetyEquipmentType.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Date }),
    __metadata("design:type", Date)
], SafetyEquipmentType.prototype, "createdAt", void 0);
//# sourceMappingURL=safety_equipment_type.js.map