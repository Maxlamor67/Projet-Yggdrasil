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
exports.UserRelations = void 0;
const session_1 = require("./session");
const account_1 = require("./account");
const team_1 = require("./team");
const swagger_1 = require("@nestjs/swagger");
class UserRelations {
}
exports.UserRelations = UserRelations;
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => session_1.Session }),
    __metadata("design:type", Array)
], UserRelations.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => account_1.Account }),
    __metadata("design:type", Array)
], UserRelations.prototype, "accounts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ isArray: true, type: () => team_1.Team }),
    __metadata("design:type", Array)
], UserRelations.prototype, "teams", void 0);
//# sourceMappingURL=user_relations.js.map