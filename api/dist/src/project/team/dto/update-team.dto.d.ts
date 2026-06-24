import { CreateTeamDto } from './create-team.dto';
declare const UpdateTeamDto_base: import("@nestjs/common").Type<Partial<Omit<CreateTeamDto, "members">>>;
export declare class UpdateTeamDto extends UpdateTeamDto_base {
    addMembers: string[];
    removeMembers: string[];
}
export {};
