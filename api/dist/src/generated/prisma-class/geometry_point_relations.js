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
exports.GeometryPointRelations = void 0;
const geometry_1 = require("./geometry");
const point_1 = require("./point");
const swagger_1 = require("@nestjs/swagger");
class GeometryPointRelations {
}
exports.GeometryPointRelations = GeometryPointRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => geometry_1.Geometry }),
    __metadata("design:type", geometry_1.Geometry)
], GeometryPointRelations.prototype, "geometry", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => point_1.Point }),
    __metadata("design:type", point_1.Point)
], GeometryPointRelations.prototype, "point", void 0);
//# sourceMappingURL=geometry_point_relations.js.map