import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UserRole} from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findOneAdmin() {
        try {
            const existingAdmin = await this.prisma.user.findFirst({
                where: {
                    role: UserRole.admin,
                },
                select: {
                    id: true,
                }
            });

            return existingAdmin || { id: null };
        } catch (_) {
            throw new InternalServerErrorException('Impossible de récupérer l\'administrateur');
        }
    }
}
