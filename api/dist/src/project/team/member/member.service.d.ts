import { CreateMemberDto } from "./dto/create-member.dto";
import { PrismaService } from "../../../prisma/prisma.service";
export declare class MemberService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(projectId: string, teamId: string, createMemberDto: CreateMemberDto): Promise<{
        name: string;
        id: string;
    }>;
    remove(projectId: string, teamId: string, id: string): Promise<void>;
}
