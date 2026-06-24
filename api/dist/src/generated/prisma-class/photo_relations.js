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
exports.PhotoRelations = void 0;
const point_to_secure_1 = require("./point_to_secure");
const swagger_1 = require("@nestjs/swagger");
class PhotoRelations {
}
exports.PhotoRelations = PhotoRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => point_to_secure_1.PointToSecure }),
    __metadata("design:type", point_to_secure_1.PointToSecure)
], PhotoRelations.prototype, "pointToSecure", void 0);
//# sourceMappingURL=photo_relations.js.map