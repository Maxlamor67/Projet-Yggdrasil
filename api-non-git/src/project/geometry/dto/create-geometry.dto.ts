import {GeometryType} from "@prisma/client";
import {
  ArrayMinSize,
  IsArray, IsDate,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsString, Min,
  ValidateIf,
  ValidateNested
} from "class-validator";
import {CreateRankedPointDto} from "../../../utils/dto/create-point.dto";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";
import {IsLowerOrHigherThan} from "../../../utils/custom-validators/IsLowerOrHigherThan";

export class CreateRouteDto {
  /**
   * Date et heure de début de la course
   * @required
   */
  @Type(() => Date)
  @IsDate({ message: 'La date de début doit être une date valide'})
  @IsNotEmpty({ message: 'La date de début est requise'})
  startAt: Date;

  /**
   * Estimation de la vitesse du participant le plus lent.
   * Vitesse estimée en km/h
   * @required
   */
  @IsNotEmpty({ message: 'La vitesse estimée du participant le plus lent est requise'})
  @IsNumber({}, { message: 'La vitesse estimée du participant le plus lent doit être un nombre'})
  @Min(1, { message: 'La vitesse estimée du participant le plus lent doit être au minimum 1 km/h'})
  slowerParticipantSpeedEstimate: number;

  /**
   * Estimation de la vitesse du participant le plus rapide.
   * Vitesse estimée en km/h. Doit être supérieure à la vitesse du participant le plus lent et au minimum 1.
   * @required
   */
  @IsNotEmpty({ message: 'La vitesse estimée du participant le plus rapide est requise'})
  @IsNumber({}, { message: 'La vitesse estimée du participant le plus rapide doit être un nombre'})
  @IsLowerOrHigherThan((o) => o.slowerParticipantSpeedEstimate, 'higher', { message: 'La vitesse estimée du participant le plus rapide doit être supérieure à celle du participant le plus lent'})
  @Min(1, { message: 'La vitesse estimée du participant le plus rapide doit être au minimum 1 km/h'})
  fasterParticipantSpeedEstimate: number;
}

export class CreateGeometryDto {
  /**
   * Type de géométrie à créer.
   * Définit le type de géométrie
   * @required
   */
  @ApiProperty({ enum: GeometryType })
  @IsNotEmpty({ message: 'Le type de géométrie est requis'})
  @IsEnum(GeometryType, { message: 'Le type de géométrie doit être une valeur valide'})
  type: GeometryType;

  /**
   * Nom de la géométrie.
   * Libellé identifiant la géométrie.
   * @required
   */
  @IsNotEmpty({ message: 'Le nom de la géométrie est requis'})
  @IsString({ message: 'Le nom de la géométrie doit être une chaîne de caractères'})
  name: string;

  /**
   * Points constituant la géométrie.
   * Liste ordonnée de points définissant la forme de la géométrie. Doit contenir au minimum 2 points.
   * @required
   */
  @ApiProperty({ type: () => CreateRankedPointDto, isArray: true })
  @IsNotEmpty({ message: 'Les points de la géométrie sont requis'})
  @IsArray({ message: 'Les points de la géométrie doivent être un tableau'})
  @ValidateNested({ each: true, message: 'Chaque point doit être valide'})
  @ArrayMinSize(2, { message: 'Au moins 2 points doivent être fournis'})
  points: CreateRankedPointDto[];

  /**
   * Informations sur la route.
   * Données spécifiques à une route, requises uniquement si le type est ROUTE.
   * @optional
   */
  @ApiProperty({ type: () => CreateRouteDto })
  @ValidateIf((o) => o.type === GeometryType.ROUTE)
  route?: CreateRouteDto;
}
