import {Controller, Get, HttpCode, HttpStatus} from '@nestjs/common';
import { UserService } from './user.service';
import {ApiOkResponse} from "@nestjs/swagger";
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";
import {GetAdminResponse} from "../utils/types/responses";

/**
 * Contrôleur gérant les requêtes liées aux utilisateurs.
 * Fournit des endpoints pour récupérer les informations des utilisateurs.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Récupère les informations de l'administrateur.
   * Cet endpoint est accessible sans authentification.
   *
   * @returns Les informations de l'administrateur
   */
  @AllowAnonymous()
  @ApiOkResponse({
    type: () => GetAdminResponse,
  })
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  findOneAdmin() {
    return this.userService.findOneAdmin();
  }
}
