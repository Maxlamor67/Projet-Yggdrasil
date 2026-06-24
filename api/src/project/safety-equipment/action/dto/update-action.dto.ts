import {IsOptional, IsString} from "class-validator";

export class UpdateActionDto {
    /**
     * Identifiant de l'équipe responsable.
     * Référence l'équipe chargée d'effectuer l'action.
     * @required
     */
    @IsString()
    @IsOptional()
    teamId?: string;
}
