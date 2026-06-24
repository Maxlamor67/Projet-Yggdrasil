import {OmitType, PartialType} from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import {IsArray} from "class-validator";

export class UpdateTeamDto extends PartialType(OmitType(CreateTeamDto, ['members'])) {
    @IsArray({ message: 'Les membres à ajouter doivent être un tableau'})
    addMembers: string[];

    @IsArray({ message: 'Les membres à supprimer doivent être un tableau'})
    removeMembers: string[];
}
