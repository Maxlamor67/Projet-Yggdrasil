import {Controller, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus} from '@nestjs/common';
import { LengthService } from './length.service';
import { CreateLengthDto } from './dto/create-length.dto';
import { UpdateLengthDto } from './dto/update-length.dto';
import {ApiCreatedResponse, ApiNoContentResponse} from "@nestjs/swagger";
import {SafetyEquipmentTypeLength} from "../../generated/prisma-class/safety_equipment_type_length";

/**
 * Contrôleur pour la gestion des longueurs des types d'équipements de sécurité.
 * Expose les endpoints REST pour créer, mettre à jour et supprimer des longueurs.
 */
@Controller('safety-equipment-types/:safetyEquipmentTypeId/lengths')
export class LengthController {
  constructor(private readonly lengthService: LengthService) {}

  /**
   * Crée une nouvelle longueur pour un type d'équipement de sécurité.
   * @param {string} safetyEquipmentTypeId - Identifiant du type d'équipement de sécurité
   * @param {CreateLengthDto} createLengthDto - Données de la longueur à créer
   * @returns La longueur créée
   */
  @ApiCreatedResponse({
    type: () => SafetyEquipmentTypeLength,
  })
  @Post()
  create(
      @Param('safetyEquipmentTypeId') safetyEquipmentTypeId: string,
      @Body() createLengthDto: CreateLengthDto
  ) {
    return this.lengthService.create(safetyEquipmentTypeId, createLengthDto);
  }

  /**
   * Met à jour une longueur existante d'un type d'équipement de sécurité.
   * @param {string} safetyEquipmentTypeId - Identifiant du type d'équipement de sécurité
   * @param {string} id - Identifiant de la longueur à mettre à jour
   * @param {UpdateLengthDto} updateLengthDto - Données de mise à jour de la longueur
   * @returns Retourne un statut 204 No Content en cas de succès
   */
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(
      @Param('safetyEquipmentTypeId') safetyEquipmentTypeId: string,
      @Param('id') id: string,
      @Body() updateLengthDto: UpdateLengthDto
  ) {
    return this.lengthService.update(safetyEquipmentTypeId, id, updateLengthDto);
  }

  /**
   * Supprime une longueur d'un type d'équipement de sécurité.
   * @param {string} safetyEquipmentTypeId - Identifiant du type d'équipement de sécurité
   * @param {string} id - Identifiant de la longueur à supprimer
   * @returns Retourne un statut 204 No Content en cas de succès
   */
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
      @Param('safetyEquipmentTypeId') safetyEquipmentTypeId: string,
      @Param('id') id: string,
  ) {
    return this.lengthService.remove(safetyEquipmentTypeId, id);
  }
}
