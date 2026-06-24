"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSafetyEquipmentTypeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_safety_equipment_type_dto_1 = require("./create-safety-equipment-type.dto");
class UpdateSafetyEquipmentTypeDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_safety_equipment_type_dto_1.CreateSafetyEquipmentTypeDto, ['lengths', 'model'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateSafetyEquipmentTypeDto = UpdateSafetyEquipmentTypeDto;
//# sourceMappingURL=update-safety-equipment-type.dto.js.map