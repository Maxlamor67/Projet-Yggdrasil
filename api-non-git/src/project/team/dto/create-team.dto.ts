import {IsArray, IsNotEmpty, IsString, MinLength} from "class-validator";

export class CreateTeamDto {
    /**
     * Nom de l'équipe.
     * Libellé identifiant l'équipe. Doit contenir au minimum 5 caractères.
     * @required
     */
    @IsString({ message: 'Le nom de l\'équipe doit être une chaîne de caractères'})
    @IsNotEmpty({ message: 'Le nom de l\'équipe est requis'})
    @MinLength(5, { message: 'Le nom de l\'équipe doit contenir au minimum 5 caractères'})
    name: string;

    /**
     * Identifiants des membres de l'équipe.
     * Tableau contenant les identifiants des utilisateurs membres de l'équipe.
     * @required
     */
    @IsNotEmpty({ message: 'Les membres de l\'équipe sont requis'})
    @IsArray({ message: 'Les membres de l\'équipe doivent être un tableau'})
    members: string[];
}
