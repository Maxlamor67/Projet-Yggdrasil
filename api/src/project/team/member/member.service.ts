import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateMemberDto} from "./dto/create-member.dto";
import {PrismaService} from "../../../prisma/prisma.service";

@Injectable()
export class MemberService {
    constructor(private readonly prisma: PrismaService) {}

    async create(projectId: string, teamId: string, createMemberDto: CreateMemberDto) {
        try {
            const project = await this.prisma.team.update({
                where: {
                    id: teamId,
                    projectId,
                },
                data: {
                    users: {
                        connect: {
                            id: createMemberDto.userId,
                        },
                    },
                },
                select: {
                    users: {
                        where: {
                            id: createMemberDto.userId,
                        },
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                }
            });

            return project.users[0];
        } catch (_) {
          throw new InternalServerErrorException('Impossible d\'ajouter le membre à l\'équipe');
        }
    }

    async remove(projectId: string, teamId: string, id: string) {
        try {
            await this.prisma.team.update({
                where: {
                    id: teamId,
                    projectId,
                },
                data: {
                    users: {
                        disconnect: {
                            id
                        },
                    },
                }
            });
        } catch (_) {
          throw new InternalServerErrorException('Impossible de supprimer le membre de l\'équipe');
        }
    }
}
