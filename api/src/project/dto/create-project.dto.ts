import {IsArray, IsDate, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';
import {Type} from "class-transformer";
import {IsLowerOrHigherThan} from "../../utils/custom-validators/IsLowerOrHigherThan";

export class CreateProjectDto {
    /**
     * Nom du projet.
     * Doit contenir au minimum 5 caractères.
     * @required
     */
    @IsString({ message: 'Le nom du projet doit être une chaîne de caractères'})
    @IsNotEmpty({ message: 'Le nom du projet est requis'})
    @MinLength(5, { message: 'Le nom du projet doit contenir au minimum 5 caractères'})
    name: string;

    /**
     * Date de début du projet.
     * Date à laquelle le projet commence.
     * @optional
     */
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    startAtDate?: Date;

    /**
     * Date de fin du projet.
     * Date à laquelle le projet se termine. Doit être supérieure à la date de début.
     * @optional
     */
    @Type(() => Date)
    @IsLowerOrHigherThan((o) => o.startAtDate, 'higher')
    @IsDate()
    @IsOptional()
    endAtDate?: Date;
}
