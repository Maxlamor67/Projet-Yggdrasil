import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body, Put, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {Project} from "../generated/prisma-class/project";

/**
 * Contrôleur gérant les requêtes liées aux projets.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des projets.
 */
@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  /**
   * Crée un nouveau projet.
   *
   * @param dto - Données du projet à créer
   * @returns Le projet créé
   */
  @ApiCreatedResponse({
    type: () => Project,
  })
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  /**
   * Récupère tous les projets.
   *
   * @returns Liste contenant tous les projets
   */
  @ApiOkResponse({
    type: () => Project,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  /**
   * Récupère un projet spécifique.
   *
   * @param id - Identifiant unique du projet
   * @returns Le projet demandé
   */
  @ApiOkResponse({
    type: () => Project,
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Met à jour un projet spécifique.
   *
   * @param id - Identifiant unique du projet à mettre à jour
   * @param dto - Données de mise à jour du projet
   */
  @ApiNoContentResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  /**
   * Supprime un projet spécifique.
   *
   * @param id - Identifiant unique du projet à supprimer
   */
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
