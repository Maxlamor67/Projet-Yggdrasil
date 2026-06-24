import {Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put} from '@nestjs/common';
import { SafetyEquipmentService } from './safety-equipment.service';
import { CreateSafetyEquipmentDto } from './dto/create-safety-equipment.dto';
import { UpdateSafetyEquipmentDto } from './dto/update-safety-equipment.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {SafetyEquipment} from "../../generated/prisma-class/safety_equipment";
import {GetAllSafetyEquipmentsResponse, GetSafetyEquipmentResponse} from "../../utils/types/responses";

/**
 * Contrôleur gérant les requêtes liées aux équipements de sécurité d'un projet.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des équipements de sécurité.
 */
@Controller('projects/:projectId/safety-equipment')
export class SafetyEquipmentController {
  constructor(private readonly safetyEquipmentService: SafetyEquipmentService) {}

  /**
   * Crée un nouvel équipement de sécurité pour un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @param dto - Données de l'équipement de sécurité à créer
   * @returns L'équipement de sécurité créé
   */
  @ApiCreatedResponse({
    type: () => SafetyEquipment,
  })
  @Post()
  create(
      @Param("projectId") projectId: string,
      @Body() dto: CreateSafetyEquipmentDto,
  ) {
    return this.safetyEquipmentService.create(projectId, dto);
  }

  /**
   * Supprime un équipement de sécurité spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipement de sécurité à supprimer
   */
  @ApiNoContentResponse()
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
      @Param("projectId") projectId: string,
      @Param("id") id: string,
  ) {
    return this.safetyEquipmentService.remove(projectId, id);
  }

  /**
   * Récupère tous les équipements de sécurité d'un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @returns Liste contenant tous les équipements de sécurité du projet
   */
  @ApiOkResponse({
    type: () => GetAllSafetyEquipmentsResponse,
    isArray: true,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
      @Param("projectId") projectId: string,
  ) {
    return this.safetyEquipmentService.findAll(projectId);
  }

  /**
   * Récupère un équipement de sécurité spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipement de sécurité
   * @returns L'équipement de sécurité demandé
   */
  @ApiOkResponse({
    type: () => GetSafetyEquipmentResponse,
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  findOne(
      @Param("projectId") projectId: string,
      @Param("id") id: string,
  ) {
    return this.safetyEquipmentService.findOne(projectId, id);
  }

  /**
   * Met à jour un équipement de sécurité spécifique d'un projet.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique de l'équipement de sécurité à mettre à jour
   * @param dto - Données de mise à jour de l'équipement de sécurité
   */
  @ApiNoContentResponse()
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
      @Param("projectId") projectId: string,
      @Param("id") id: string,
      @Body() dto: UpdateSafetyEquipmentDto,
  ) {
    return this.safetyEquipmentService.update(projectId, id, dto);
  }
}
