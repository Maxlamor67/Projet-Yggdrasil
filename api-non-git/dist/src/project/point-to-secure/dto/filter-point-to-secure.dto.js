"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPointToSecureDto = void 0;
const openapi = require("@nestjs/swagger");
class FilterPointToSecureDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, type: () => String }, minLat: { required: false, type: () => Number }, maxLat: { required: false, type: () => Number }, minLng: { required: false, type: () => Number }, maxLng: { required: false, type: () => Number } };
    }
}
exports.FilterPointToSecureDto = FilterPointToSecureDto;
//# sourceMappingURL=filter-point-to-secure.dto.js.map