import {Controller, Body, Param, Put, HttpCode, HttpStatus} from '@nestjs/common';
import { ActionService } from './action.service';
import {UpdateActionDto} from './dto/update-action.dto';
import {ApiNoContentResponse} from "@nestjs/swagger";

/**
 * Contrôleur gérant les requêtes liées aux actions d'un équipement de sécurité.
 * Fournit des endpoints CRUD pour créer, lire, mettre à jour et supprimer des actions
 * associées à un équipement de sécurité spécifique d'un projet.
 */
@Controller('projects/:projectId/safety-equipment/:safetyEquipmentId/actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  /**
   * Met à jour une action spécifique d'un équipement de sécurité.
   *
   * @param projectId - Identifiant unique du projet
   * @param safetyEquipmentId - Identifiant unique de l'équipement de sécurité
   * @param id - Identifiant unique de l'action à mettre à jour
   * @param updateActionDto - Données de mise à jour de l'action
   */
  @ApiNoContentResponse()
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
      @Param("projectId") projectId: string,
      @Param("safetyEquipmentId") safetyEquipmentId: string,
      @Param('id') id: string,
      @Body() updateActionDto: UpdateActionDto,
  ) {
    return this.actionService.update(projectId, safetyEquipmentId, id, updateActionDto);
  }
}
