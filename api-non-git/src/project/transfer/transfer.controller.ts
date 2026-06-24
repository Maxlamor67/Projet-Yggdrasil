import {
  Controller,
  Get,
  Post,
  Param,
  Body, HttpCode, HttpStatus, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, ValidationPipe,
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse} from "@nestjs/swagger";
import {TransferService} from "./transfer.service";
import {CreateTransferDto} from "./dto/create-transfer.dto";
import {ImportDataDto, ImportRawDataDto} from "./dto/import-data.dto";
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";
import {FilesInterceptor} from "@nestjs/platform-express";
import {plainToInstance} from "class-transformer";
import {CreateTransferResponse, GetTransferPlanningResponse, GetTransferResponse} from "../../utils/types/responses";
import {Base64RepairInterceptor} from "./interceptors/base64-repair";

/**
 * Contrôleur gérant les requêtes liées aux transferts de données d'un projet.
 * Fournit des endpoints pour configurer, rejoindre, importer et exporter des données de transfert.
 */
@Controller('projects/:projectId/transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  /**
   * Configure un nouveau transfert pour un projet spécifique.
   *
   * @param projectId - Identifiant unique du projet
   * @param setupTransferDto - Données de configuration du transfert
   * @param ability - Capacités CASL pour la gestion des permissions
   * @returns Le transfert créé avec ses informations
   */
  @ApiCreatedResponse({
    type: () => CreateTransferResponse,
  })
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() setupTransferDto: CreateTransferDto,
  ) {
    return this.transferService.setupTransfer(projectId, setupTransferDto);
  }

  /**
   * Permet de rejoindre un transfert existant.
   * Cet endpoint est accessible sans authentification.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique du transfert
   * @returns Les informations du transfert
   */
  @ApiOkResponse({
    type: () => GetTransferResponse,
  })
  @AllowAnonymous()
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  joinTransfer(
      @Param('projectId') projectId: string,
      @Param('id') id: string,
  ) {
    return this.transferService.joinTransfer(projectId, id);
  }

  /**
   * Importe des données dans un transfert, incluant des points à sécuriser et leurs photos associées.
   * Cet endpoint accepte des fichiers multipart (photos) et valide leur format (PNG, JPEG, JPG).
   * Les photos sont associées aux points à sécuriser via un préfixe dans leur nom de fichier.
   * Accessible sans authentification.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique du transfert
   * @param dto - Données brutes du transfert au format JSON stringifié
   * @param rawPhotos - Liste de fichiers photos à importer
   */
  @ApiNoContentResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          description: 'JSON stringifié contenant les métadonnées'
        },
        rawPhotos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['data', 'rawPhotos'],
    },
  })
  @AllowAnonymous()
  @Post(':id/import')
  @UseInterceptors(
      FilesInterceptor('photos'),
      Base64RepairInterceptor
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async importData(
      @Param("projectId") projectId: string,
      @Param('id') id: string,
      @Body() dto: ImportRawDataDto,
      @UploadedFiles(
          new ParseFilePipeBuilder()
              .addFileTypeValidator({ fileType: /image\/(png|jpeg|jpg)/ })
              .build({ fileIsRequired: false })
      ) rawPhotos: Array<Express.Multer.File>,
  ) {
    const pipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    });

    const data = plainToInstance(ImportDataDto, JSON.parse(dto.data));
    const newDto: ImportDataDto = await pipe.transform(data, {
      type: 'body',
      metatype: ImportDataDto,
    });

    const result = newDto.pointsToSecure.map((pointToSecure) => {
      const photos = rawPhotos.filter(f => f.originalname.startsWith(`file_${pointToSecure.index}_`));

      return {
        photos,
        pointToSecure,
      };
    });
    return this.transferService.importData(projectId, id, result);
  }

  /**
   * Exporte les données de planification d'un transfert spécifique.
   * Accessible sans authentification.
   *
   * @param projectId - Identifiant unique du projet
   * @param id - Identifiant unique du transfert
   * @param teamId - Identifiant unique de l'équipe pour laquelle exporter les données
   * @returns Les données de planification exportées
   */
  @ApiOkResponse({
    type: () => GetTransferPlanningResponse,
  })
  @AllowAnonymous()
  @Post(":id/export-planning/:teamId")
  @HttpCode(HttpStatus.OK)
  exportPlanningData(
      @Param('projectId') projectId: string,
      @Param('id') id: string,
      @Param('teamId') teamId: string,
  ) {
    return this.transferService.exportPlanningData(projectId, id, teamId);
  }
}
