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
exports.TeamRelations = void 0;
const project_1 = require("./project");
const action_1 = require("./action");
const user_1 = require("./user");
const swagger_1 = require("@nestjs/swagger");
class TeamRelations {
}
exports.TeamRelations = TeamRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => project_1.Project }),
    __metadata("design:type", project_1.Project)
], TeamRelations.prototype, "project", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => action_1.Action }),
    __metadata("design:type", Array)
], TeamRelations.prototype, "actions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => user_1.User }),
    __metadata("design:type", Array)
], TeamRelations.prototype, "users", void 0);
//# sourceMappingURL=team_relations.js.map