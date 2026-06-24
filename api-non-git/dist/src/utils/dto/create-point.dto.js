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
exports.CreateRankedPointDto = exports.CreatePointDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePointDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { latitude: { required: true, type: () => Number, description: "Latitude du point.\nCoordonn\u00E9e g\u00E9ographique en degr\u00E9s d\u00E9cimaux.\n@required" }, longitude: { required: true, type: () => Number, description: "Longitude du point.\nCoordonn\u00E9e g\u00E9ographique en degr\u00E9s d\u00E9cimaux.\n@required" } };
    }
}
exports.CreatePointDto = CreatePointDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La latitude est requise' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La latitude doit être un nombre' }),
    (0, class_validator_1.IsLatitude)({ message: 'La latitude doit être entre -90 et 90' }),
    __metadata("design:type", Number)
], CreatePointDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'La longitude est requise' }),
    (0, class_validator_1.IsNumber)({}, { message: 'La longitude doit être un nombre' }),
    (0, class_validator_1.IsLongitude)({ message: 'La longitude doit être entre -180 et 180' }),
    __metadata("design:type", Number)
], CreatePointDto.prototype, "longitude", void 0);
class CreateRankedPointDto extends CreatePointDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { rank: { required: true, type: () => Number, description: "Rang du point.\nD\u00E9finit la position du point dans un ordre de classement. Doit \u00EAtre sup\u00E9rieur ou \u00E9gal \u00E0 0.\n@required", minimum: 0 } };
    }
}
exports.CreateRankedPointDto = CreateRankedPointDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le rang du point est requis' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Le rang du point doit être un nombre' }),
    (0, class_validator_1.Min)(0, { message: 'Le rang du point doit être supérieur ou égal à 0' }),
    __metadata("design:type", Number)
], CreateRankedPointDto.prototype, "rank", void 0);
//# sourceMappingURL=create-point.dto.js.map