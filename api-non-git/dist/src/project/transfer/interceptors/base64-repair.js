"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64RepairInterceptor = void 0;
const common_1 = require("@nestjs/common");
let Base64RepairInterceptor = class Base64RepairInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        let files = [];
        if (req.files) {
            files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        }
        else if (req.file) {
            files = [req.file];
        }
        files.forEach(file => {
            if (file.encoding === '7bit') {
                try {
                    const base64Content = file.buffer.toString('utf8');
                    const binaryBuffer = Buffer.from(base64Content, 'base64');
                    if (binaryBuffer[0] === 0xFF && binaryBuffer[1] === 0xD8) {
                        file.buffer = binaryBuffer;
                        file.size = binaryBuffer.length;
                        file.encoding = '7bit';
                        return file;
                    }
                    else if (binaryBuffer[0] === 0x89 && binaryBuffer[1] === 0x50) {
                        file.buffer = binaryBuffer;
                        file.size = binaryBuffer.length;
                        return file;
                    }
                }
                catch (e) {
                    throw new common_1.BadRequestException('Le fichier téléchargé est corrompu ou n\'est pas au bon format.');
                }
            }
            return file;
        });
        return next.handle();
    }
};
exports.Base64RepairInterceptor = Base64RepairInterceptor;
exports.Base64RepairInterceptor = Base64RepairInterceptor = __decorate([
    (0, common_1.Injectable)()
], Base64RepairInterceptor);
//# sourceMappingURL=base64-repair.js.map