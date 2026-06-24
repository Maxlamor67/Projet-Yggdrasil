import {IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

/**
 * DTO pour la création d'une longueur.
 */
export class CreateLengthDto {
    /**
     * Valeur de la longueur en mètres.
     * Doit être un nombre valide et non vide.
     * @type {number}
     */
    @IsNotEmpty({ message: 'La longueur est requise'})
    @IsNumber({}, { message: 'La longueur doit être un nombre'})
    @Type(() => Number)
    length: number;
}