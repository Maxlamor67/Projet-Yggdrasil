"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePointToSecureDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_point_to_secure_dto_1 = require("./create-point-to-secure.dto");
class UpdatePointToSecureDto extends (0, swagger_1.PartialType)(create_point_to_secure_dto_1.CreatePointToSecureDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePointToSecureDto = UpdatePointToSecureDto;
//# sourceMappingURL=update-point-to-secure.dto.js.map