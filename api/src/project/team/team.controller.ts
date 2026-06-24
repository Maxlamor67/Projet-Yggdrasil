import {Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {Team} from "../../generated/prisma-class/team";
import {GetTeamResponse} from "../../utils/types/responses";
import {ActionsAndSafetyEquipmentTypeLength} from "../../utils/types/transfer";

/**
 * Contrôleur gérant les requêtes liées aux équipes d'un projet.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des équipes.
 */
@Controller('projects/:projectId/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  /**
   * Crée une nouvelle équipe pour un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @param createTeamDto - Données de l'équipe à créer
   * @returns L'équipe créée
   */
  @ApiCreatedResponse({
    type: () => Team,
  })
  @Post()
  create(
      @Param("projectId") projectId: string,
      @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamService.create(projectId, createTeamDto);
  }

  /**
   * Récupère toutes les équipes d'un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @returns Liste contenant toutes les équipes du projet
   */
  @ApiOkResponse({
    type: () => Team,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
      @Param("projectId") projectId: string,
  ) {
    return this.teamService.findAll(projectId);
  }

  /**
   * Récupère une équipe spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipe
   * @returns L'équipe demandée
   */
  @ApiOkResponse({
    type: () => GetTeamResponse,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
  ) {
    return this.teamService.findOne(projectId, id);
  }

  /**
   * Met à jour une équipe spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipe à mettre à jour
   * @param updateTeamDto - Données de mise à jour de l'équipe
   */
  @ApiNoContentResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
      @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.update(projectId, id, updateTeamDto);
  }

  /**
   * Supprime une équipe spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipe à supprimer
   */
  @ApiNoContentResponse()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
  ) {
    return this.teamService.remove(projectId, id);
  }

  /**
   * Récupère le planning d'une équipe spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipe
   * @returns Le planning de l'équipe, incluant les actions et les types d'équipements de sécurité
   */
  @ApiOkResponse({
    type: () => ActionsAndSafetyEquipmentTypeLength,
    isArray: true,
  })
  @Get(':id/planning')
  @HttpCode(HttpStatus.OK)
  findOnePlanning(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
  ) {
    return this.teamService.findOnePlanning(projectId, id);
  }
}
