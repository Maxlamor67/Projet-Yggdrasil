import {BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class Base64RepairInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();

        let files = [];
        if (req.files) {
            files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        } else if (req.file) {
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
                } catch (e) {
                    throw new BadRequestException('Le fichier téléchargé est corrompu ou n\'est pas au bon format.');
                }
            }
            return file;
        });

        return next.handle();
    }
}