"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLengthDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_length_dto_1 = require("./create-length.dto");
class UpdateLengthDto extends (0, swagger_1.PartialType)(create_length_dto_1.CreateLengthDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateLengthDto = UpdateLengthDto;
//# sourceMappingURL=update-length.dto.js.map