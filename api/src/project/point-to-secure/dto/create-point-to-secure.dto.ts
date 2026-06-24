import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString, ValidateNested,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {CreatePointDto} from "../../../utils/dto/create-point.dto";

export class CreatePointToSecureDto {
  /**
   * Identifiant du type d'équipement de sécurité.
   * Référence le type d'équipement de sécurité à installer au point.
   * @optional
   */
  @IsString({ message: 'L\'ID du type d\'équipement doit être une chaîne de caractères'})
  @IsOptional()
  safetyEquipmentTypeId?: string

  /**
   * Commentaire additionnel.
   * Texte libre pour ajouter des précisions sur le point à sécuriser.
   * @optional
   */
  @IsString({ message: 'Le commentaire doit être une chaîne de caractères'})
  @IsOptional()
  comment?: string;

  /**
   * Coordonnées géographiques du point à sécuriser.
   * Objet contenant les informations de localisation du point.
   * @required
   */
  @ApiProperty({ type: () => CreatePointDto })
  @ValidateNested({ message: 'Le point doit être valide'})
  @IsNotEmpty({ message: 'Le point est requis'})
  point: CreatePointDto;

  /**
   * Indicateur de traitement du point.
   * Spécifie si le point à sécuriser a déjà été traité ou non.
   * @required
   */
  @IsBoolean({ message: 'L\'indicateur de traitement doit être un booléen'})
  @IsNotEmpty({ message: 'L\'indicateur de traitement est requis'})
  isTreated: boolean;
}
