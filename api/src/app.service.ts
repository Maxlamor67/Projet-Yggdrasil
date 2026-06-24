import {Injectable, NotFoundException} from '@nestjs/common';
import * as os from "node:os";
import {PrismaService} from "./prisma/prisma.service";

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    getIpAddress() {
        try {
            const interfaces = os.networkInterfaces();
            for (const iFace of Object.values(interfaces)) {
                for (const cfg of iFace) {
                    if (cfg.family === "IPv4" && !cfg.internal)
                    {
                        return {
                            ip: cfg.address,
                            port: Number(process.env.HTTP_PORT),
                        };
                    }
                }
            }
        } catch (_) {
            throw new NotFoundException('Aucune adresse IP trouvée');
        }
    }
}
