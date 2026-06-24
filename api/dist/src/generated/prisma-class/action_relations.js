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
exports.ActionRelations = void 0;
const safety_equipment_1 = require("./safety_equipment");
const team_1 = require("./team");
const swagger_1 = require("@nestjs/swagger");
class ActionRelations {
}
exports.ActionRelations = ActionRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => safety_equipment_1.SafetyEquipment }),
    __metadata("design:type", safety_equipment_1.SafetyEquipment)
], ActionRelations.prototype, "safetyEquipment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => team_1.Team }),
    __metadata("design:type", team_1.Team)
], ActionRelations.prototype, "team", void 0);
//# sourceMappingURL=action_relations.js.map