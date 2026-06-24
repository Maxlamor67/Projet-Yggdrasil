import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { SafetyEquipmentTypeService } from './safety-equipment-type.service';
import { CreateSafetyEquipmentTypeDto } from './dto/create-safety-equipment-type.dto';
import { UpdateSafetyEquipmentTypeDto } from './dto/update-safety-equipment-type.dto';
import {ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {GetSafetyEquipmentTypeResponse} from "../utils/types/responses";
import {SafetyEquipmentType} from "../generated/prisma-class/safety_equipment_type";

/**
 * Contrôleur pour la gestion des types d'équipements de sécurité.
 * Expose les endpoints REST pour créer, lire, mettre à jour et supprimer des types d'équipements.
 */
@Controller('safety-equipment-types')
export class SafetyEquipmentTypeController {
  constructor(private readonly safetyEquipmentTypeService: SafetyEquipmentTypeService) {}

  /**
   * Crée un nouveau type d'équipement de sécurité.
   * @param {CreateSafetyEquipmentTypeDto} createSafetyEquipmentTypeDto - Données du type d'équipement à créer
   * @returns Le type d'équipement créé
   */
  @ApiCreatedResponse({
    type: () => SafetyEquipmentType,
  })
  @Post()
  create(@Body() createSafetyEquipmentTypeDto: CreateSafetyEquipmentTypeDto) {
    return this.safetyEquipmentTypeService.create(createSafetyEquipmentTypeDto);
  }

  /**
   * Récupère la liste de tous les types d'équipements de sécurité.
   * @returns La liste des types d'équipements
   */
  @ApiOkResponse({
    type: () => GetSafetyEquipmentTypeResponse,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.safetyEquipmentTypeService.findAll();
  }

  /**
   * Met à jour un type d'équipement de sécurité existant.
   * @param {string} id - Identifiant du type d'équipement à mettre à jour
   * @param {UpdateSafetyEquipmentTypeDto} updateSafetyEquipmentTypeDto - Données de mise à jour du type d'équipement
   * @returns Retourne un statut 204 No Content en cas de succès
   */
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSafetyEquipmentTypeDto: UpdateSafetyEquipmentTypeDto) {
    return this.safetyEquipmentTypeService.update(id, updateSafetyEquipmentTypeDto);
  }

  /**
   * Supprime un type d'équipement de sécurité.
   * @param {string} id - Identifiant du type d'équipement à supprimer
   * @returns Retourne un statut 204 No Content en cas de succès
   */
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.safetyEquipmentTypeService.remove(id);
  }
}
