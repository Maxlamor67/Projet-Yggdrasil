import {
    Controller,
    Post,
    Delete,
    Body,
    Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import {ApiCreatedResponse, ApiNoContentResponse} from "@nestjs/swagger";
import {GetMemberResponse} from "../../../utils/types/responses";

/**
 * Contrôleur gérant les requêtes liées aux membres d'une équipe.
 * Fournit des endpoints pour ajouter et supprimer des membres d'une équipe spécifique d'un projet.
 */
@Controller('projects/:projectId/teams/:teamId/members')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    /**
     * Ajoute un nouveau membre à une équipe spécifique.
     *
     * @param projectId - Identifiant unique du projet
     * @param teamId - Identifiant unique de l'équipe
     * @param dto - Données du membre à ajouter
     * @returns Le membre créé
     */
    @ApiCreatedResponse({
        type: () => GetMemberResponse,
    })
    @Post()
    create(
        @Param("projectId") projectId: string,
        @Param("teamId") teamId: string,
        @Body() dto: CreateMemberDto,
    ) {
        return this.memberService.create(projectId, teamId, dto);
    }

    /**
     * Supprime un membre spécifique d'une équipe.
     *
     * @param projectId - Identifiant unique du projet
     * @param teamId - Identifiant unique de l'équipe
     * @param id - Identifiant unique du membre à supprimer
     */
    @ApiNoContentResponse()
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(
        @Param("projectId") projectId: string,
        @Param("teamId") teamId: string,
        @Param('id') id: string,
    ) {
        return this.memberService.remove(projectId, teamId, id);
    }
}
