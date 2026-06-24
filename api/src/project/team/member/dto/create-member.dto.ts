import {IsNotEmpty, IsString} from "class-validator";

export class CreateMemberDto {
    /**
     * Identifiant de l'utilisateur.
     * Référence l'utilisateur à ajouter comme membre de l'équipe.
     * @required
     */
    @IsNotEmpty()
    @IsString()
    userId: string
}
