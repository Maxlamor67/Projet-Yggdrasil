import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    HttpStatus,
    HttpCode,
    Put, Header, Res,
} from '@nestjs/common';
import { PointToSecureService } from './point-to-secure.service';
import { CreatePointToSecureDto } from './dto/create-point-to-secure.dto';
import { FilterPointToSecureDto } from './dto/filter-point-to-secure.dto';
import {UpdatePointToSecureDto} from "./dto/update-point-to-secure.dto";
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {Response} from "express";
import {GetAllPointsToSecureResponse, GetPointToSecureResponse} from "../../utils/types/responses";
import {PointToSecure} from "../../generated/prisma-class/point_to_secure";

/**
 * Contrôleur gérant les requêtes liées aux points à sécuriser d'un projet.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des points à sécuriser,
 * ainsi que pour récupérer les photos associées.
 */
@Controller('projects/:projectId/points-to-secure')
export class PointToSecureController {
    constructor(private readonly service: PointToSecureService) {}

    /**
     * Crée un nouveau point à sécuriser pour un projet spécifique.
     *
     * @param projectId - Identifiant unique du projet
     * @param dto - Données du point à sécuriser à créer
     * @returns Le point à sécuriser créé
     */
    @ApiCreatedResponse({
      type: () => PointToSecure,
    })
    @Post()
    create(
        @Param("projectId") projectId: string,
        @Body() dto: CreatePointToSecureDto,
    ) {
        return this.service.create(projectId, dto);
    }

    /**
     * Supprime un point à sécuriser spécifique d'un projet.
     *
     * @param projectId - Identifiant unique du projet
     * @param id - Identifiant unique du point à sécuriser à supprimer
     */
    @ApiNoContentResponse()
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param("projectId") projectId: string,
        @Param("id") id: string,
    ) {
        return this.service.remove(projectId, id);
    }

    /**
     * Récupère tous les points à sécuriser d'un projet avec filtres optionnels.
     *
     * @param projectId - Identifiant unique du projet
     * @param filters - Critères de filtrage pour les points à sécuriser
     * @returns Liste contenant tous les points à sécuriser correspondant aux filtres
     */
    @ApiOkResponse({
      type: () => GetAllPointsToSecureResponse,
      isArray: true,
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(
        @Param("projectId") projectId: string,
        @Query() filters: FilterPointToSecureDto,
    ) {
        return this.service.findAll(projectId, filters);
    }

    /**
     * Récupère un point à sécuriser spécifique d'un projet.
     *
     * @param projectId - Identifiant unique du projet
     * @param id - Identifiant unique du point à sécuriser
     * @returns Le point à sécuriser demandé
     */
    @ApiOkResponse({
      type: () => GetPointToSecureResponse,
    })
    @Get(":id")
    @HttpCode(HttpStatus.OK)
    findOne(
        @Param("projectId") projectId: string,
        @Param("id") id: string,
    ) {
        return this.service.findOne(projectId, id);
    }

    /**
     * Met à jour un point à sécuriser spécifique d'un projet.
     *
     * @param projectId - Identifiant unique du projet
     * @param id - Identifiant unique du point à sécuriser à mettre à jour
     * @param dto - Données de mise à jour du point à sécuriser
     */
    @ApiNoContentResponse()
    @Put(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    update(
        @Param("projectId") projectId: string,
        @Param("id") id: string,
        @Body() dto: UpdatePointToSecureDto,
    ) {
        return this.service.update(projectId, id, dto);
    }

    /**
     * Récupère une photo associée à un point à sécuriser.
     * Les photos sont mises en cache pendant 24 heures côté client.
     *
     * @param projectId - Identifiant unique du projet
     * @param id - Identifiant unique du point à sécuriser
     * @param photoId - Identifiant unique de la photo
     * @param res - Objet pour envoyer la réponse
     * @returns Photo avec le type MIME approprié
     */
    @Get(':id/photos/:photoId')
    @HttpCode(HttpStatus.OK)
    @Header('Cache-Control', 'public, max-age=86400')
    async findTile(
        @Param("projectId") projectId: string,
        @Param("id") id: string,
        @Param("photoId") photoId: string,
        @Res() res: Response,
    ) {
        const photo = await this.service.findOnePhoto(projectId, id, photoId);
        res.setHeader('Content-Length', photo.data.length);
        res.setHeader('Content-Type', photo.mimeType);
        res.send(photo.data);
    }
}
