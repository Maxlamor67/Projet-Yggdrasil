import {SafetyEquipmentTypeModel} from "@prisma/client";
import {ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {CreateLengthDto} from "../length/dto/create-length.dto";
import {ApiProperty} from "@nestjs/swagger";
import { Type } from "class-transformer";

/**
 * DTO pour la création d'un type d'équipement de sécurité.
 */
export class CreateSafetyEquipmentTypeDto {
    /**
     * Nom du type d'équipement de sécurité.
     * @type {string}
     * @example "Casque de protection"
     */
    @IsNotEmpty({ message: 'Le nom du type d\'équipement est requis'})
    @IsString({ message: 'Le nom du type d\'équipement doit être une chaîne de caractères'})
    name: string;

    /**
     * Modèle du type d'équipement de sécurité.
     * Détermine le type géométrique ou la catégorie de l'équipement.
     * @type {SafetyEquipmentTypeModel}
     */
    @ApiProperty({ enum: SafetyEquipmentTypeModel })
    @IsNotEmpty({ message: 'Le modèle de l\'équipement est requis'})
    @IsEnum(SafetyEquipmentTypeModel, { message: 'Le modèle de l\'équipement doit être une valeur valide'})
    model: SafetyEquipmentTypeModel;

    /**
     * Liste des longueurs associées au type d'équipement.
     * Doit contenir au minimum un élément.
     * @type {CreateLengthDto[]}
     * 
     */
    @ApiProperty({isArray: true, type: () => CreateLengthDto})
    @IsArray({ message: 'Les longueurs doivent être un tableau'})
    @ArrayMinSize(1, { message: 'Au moins une longueur doit être fournie'})
    @Type(() => CreateLengthDto)
    lengths: CreateLengthDto[];
}
