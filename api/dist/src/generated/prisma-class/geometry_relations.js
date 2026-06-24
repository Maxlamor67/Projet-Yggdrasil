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
exports.GeometryRelations = void 0;
const project_1 = require("./project");
const route_1 = require("./route");
const geometry_point_1 = require("./geometry_point");
const swagger_1 = require("@nestjs/swagger");
class GeometryRelations {
}
exports.GeometryRelations = GeometryRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => project_1.Project }),
    __metadata("design:type", project_1.Project)
], GeometryRelations.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => route_1.Route }),
    __metadata("design:type", route_1.Route)
], GeometryRelations.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => geometry_point_1.GeometryPoint }),
    __metadata("design:type", Array)
], GeometryRelations.prototype, "geometryPoints", void 0);
//# sourceMappingURL=geometry_relations.js.map