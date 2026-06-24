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
exports.CreateProjectDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const IsLowerOrHigherThan_1 = require("../../utils/custom-validators/IsLowerOrHigherThan");
class CreateProjectDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, description: "Nom du projet.\nDoit contenir au minimum 5 caract\u00E8res.\n@required", minLength: 5 }, startAtDate: { required: false, type: () => Date, description: "Date de d\u00E9but du projet.\nDate \u00E0 laquelle le projet commence.\n@optional" }, endAtDate: { required: false, type: () => Date, description: "Date de fin du projet.\nDate \u00E0 laquelle le projet se termine. Doit \u00EAtre sup\u00E9rieure \u00E0 la date de d\u00E9but.\n@optional" } };
    }
}
exports.CreateProjectDto = CreateProjectDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Le nom du projet doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom du projet est requis' }),
    (0, class_validator_1.MinLength)(5, { message: 'Le nom du projet doit contenir au minimum 5 caractères' }),
    __metadata("design:type", String)
], CreateProjectDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "startAtDate", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Date),
    (0, IsLowerOrHigherThan_1.IsLowerOrHigherThan)((o) => o.startAtDate, 'higher'),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateProjectDto.prototype, "endAtDate", void 0);
//# sourceMappingURL=create-project.dto.js.map