import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param, Put, HttpCode, HttpStatus,
} from '@nestjs/common';
import { GeometryService } from './geometry.service';
import { CreateGeometryDto } from './dto/create-geometry.dto';
import { UpdateGeometryDto } from './dto/update-geometry.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {Geometry} from "../../generated/prisma-class/geometry";
import {GetGeometryResponse} from "../../utils/types/responses";

/**
 * Contrôleur gérant les requêtes liées aux géométries d'un projet.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des géométries.
 */
@Controller('projects/:projectId/geometries')
export class GeometryController {
  constructor(private service: GeometryService) {}

  /**
   * Récupère toutes les géométries d'un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @returns Un tableau contenant toutes les géométries du projet
   */
  @ApiOkResponse({
    type: () => GetGeometryResponse,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
      @Param("projectId") projectId: string,
  ) {
    return this.service.findAll(projectId);
  }

  /**
   * Récupère une géométrie spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de la géométrie
   * @returns La géométrie demandée
   */
  @ApiOkResponse({
    type: () => GetGeometryResponse,
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
   * Crée une nouvelle géométrie pour un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @param dto - Données de la géométrie à créer
   * @returns La géométrie créée
   */
  @ApiCreatedResponse({
    type: () => Geometry,
  })
  @Post()
  create(
      @Param("projectId") projectId: string,
      @Body() dto: CreateGeometryDto,
  ) {
    return this.service.create(projectId, dto);
  }

  /**
   * Supprime une géométrie spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de la géométrie à supprimer
   */
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
  ) {
    return this.service.remove(projectId, id);
  }

  /**
   * Met à jour une géométrie spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de la géométrie à mettre à jour
   * @param dto - Données de mise à jour de la géométrie
   */
  @ApiNoContentResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
      @Body() dto: UpdateGeometryDto,
  ) {
    return this.service.update(projectId, id, dto);
  }
}
