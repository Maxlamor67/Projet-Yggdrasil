import {Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { AttentionPointService } from './attention-point.service';
import { CreateAttentionPointDto } from './dto/create-attention-point.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {AttentionPoint} from "../../generated/prisma-class/attention_point";
import {GetAttentionPointsResponse} from "../../utils/types/responses";

/**
 * Contrôleur gérant les requêtes liées aux points d'attention d'un projet.
 * Fournit des endpoints CRUD pour créer, lire et supprimer des points d'attention.
 */
@Controller('projects/:projectId/attention-points')
export class AttentionPointController {
  constructor(private readonly attentionPointService: AttentionPointService) {}

  /**
   * Crée un nouveau point d'attention pour un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @param createAttentionPointDto - Données du point d'attention à créer
   * @returns Le point d'attention créé
   */
  @ApiCreatedResponse({
    type: () => AttentionPoint,
  })
  @Post()
  create(
      @Param("projectId") projectId: string,
      @Body() createAttentionPointDto: CreateAttentionPointDto
  ) {
    return this.attentionPointService.create(projectId, createAttentionPointDto);
  }

  /**
   * Récupère tous les points d'attention d'un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @returns Liste contenant tous les points d'attention du projet
   */
  @ApiOkResponse({
    type: () => GetAttentionPointsResponse,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
      @Param("projectId") projectId: string,
  ) {
    return this.attentionPointService.findAll(projectId);
  }

  /**
   * Récupère un point d'attention spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique du point d'attention
   * @returns Le point d'attention demandé
   */
  @ApiOkResponse({
    type: () => GetAttentionPointsResponse,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
      @Param("projectId") projectId: string,
      @Param('id') id: string
  ) {
    return this.attentionPointService.findOne(projectId, id);
  }

  /**
   * Supprime un point d'attention spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique du point d'attention à supprimer
   */
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
      @Param("projectId") projectId: string,
      @Param('id') id: string
  ) {
    return this.attentionPointService.remove(projectId, id);
  }
}
