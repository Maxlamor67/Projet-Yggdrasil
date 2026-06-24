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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const os = require("node:os");
const prisma_service_1 = require("./prisma/prisma.service");
let AppService = class AppService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getIpAddress() {
        try {
            const interfaces = os.networkInterfaces();
            for (const iFace of Object.values(interfaces)) {
                for (const cfg of iFace) {
                    if (cfg.family === "IPv4" && !cfg.internal) {
                        return {
                            ip: cfg.address,
                            port: Number(process.env.HTTP_PORT),
                        };
                    }
                }
            }
        }
        catch (_) {
            throw new common_1.NotFoundException('Aucune adresse IP trouvée');
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map