"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyEquipmentTypeModule = void 0;
const common_1 = require("@nestjs/common");
const safety_equipment_type_service_1 = require("./safety-equipment-type.service");
const safety_equipment_type_controller_1 = require("./safety-equipment-type.controller");
const length_module_1 = require("./length/length.module");
let SafetyEquipmentTypeModule = class SafetyEquipmentTypeModule {
};
exports.SafetyEquipmentTypeModule = SafetyEquipmentTypeModule;
exports.SafetyEquipmentTypeModule = SafetyEquipmentTypeModule = __decorate([
    (0, common_1.Module)({
        controllers: [safety_equipment_type_controller_1.SafetyEquipmentTypeController],
        providers: [safety_equipment_type_service_1.SafetyEquipmentTypeService],
        imports: [length_module_1.LengthModule],
    })
], SafetyEquipmentTypeModule);
//# sourceMappingURL=safety-equipment-type.module.js.map