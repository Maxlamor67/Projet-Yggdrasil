import {ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {CreateRankedPointDto} from "../../../utils/dto/create-point.dto";
import {Type} from "class-transformer";
import {IsLowerOrHigherThan} from "../../../utils/custom-validators/IsLowerOrHigherThan";

export class CreateSafetyEquipmentDto {
    /**
     * Identifiant du type de longueur d'équipement de sécurité.
     * Référence le type et la longueur de l'équipement de sécurité à installer.
     * @required
     */
    @IsString({ message: 'L\'ID du type d\'équipement doit être une chaîne de caractères'})
    @IsNotEmpty({ message: 'Le type d\'équipement est requis'})
    safetyEquipmentTypeLengthId: string;

    /**
     * Date de mise en place de l'équipement.
     * Date à laquelle l'équipement de sécurité est installé.
     * @required
     */
    @Type(() => Date)
    @IsDate({ message: 'La date de mise en place doit être une date valide'})
    @IsNotEmpty({ message: 'La date de mise en place est requise'})
    setAt: Date;

    /**
     * Date de retrait de l'équipement.
     * Date à laquelle l'équipement de sécurité est démonté. Doit être supérieure à la date de mise en place.
     * @required
     */
    @Type(() => Date)
    @IsDate({ message: 'La date de retrait doit être une date valide'})
    @IsLowerOrHigherThan((o) => o.setAt, 'higher', { message: 'La date de retrait doit être supérieure à la date de mise en place'})
    unsetAt: Date;

    /**
     * Points constituant l'équipement de sécurité.
     * Tableau ordonné de points définissant l'emplacement de l'équipement. Doit contenir au minimum 1 point.
     * @required
     */
    @ApiProperty({ type: () => CreateRankedPointDto, isArray: true })
    @IsNotEmpty({ message: 'Les points de l\'équipement sont requis'})
    @IsArray({ message: 'Les points de l\'équipement doivent être un tableau'})
    @ValidateNested({ each: true, message: 'Chaque point doit être valide'})
    @ArrayMinSize(1, { message: 'Au moins un point doit être fourni'})
    points: CreateRankedPointDto[];

    @IsString({ message: 'L\'ID de l\'équipe de mise en place doit être une chaîne de caractères'})
    @IsOptional()
    setTeamId?: string;

    @IsString({ message: 'L\'ID de l\'équipe de retrait doit être une chaîne de caractères'})
    @IsOptional()
    unsetTeamId?: string;
}
