"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGeometryDto = void 0;
const openapi = require("@nestjs/swagger");
const create_geometry_dto_1 = require("./create-geometry.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateGeometryDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_geometry_dto_1.CreateGeometryDto, ['type'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateGeometryDto = UpdateGeometryDto;
//# sourceMappingURL=update-geometry.dto.js.map