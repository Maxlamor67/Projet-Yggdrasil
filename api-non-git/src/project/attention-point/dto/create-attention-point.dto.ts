import {IsNotEmpty, IsString, ValidateNested} from "class-validator";
import {CreatePointDto} from "../../../utils/dto/create-point.dto";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class CreateAttentionPointDto {
    /**
     * Description du point d'attention.
     * Texte explicatif détaillant le point d'attention à créer.
     * @required
     */
    @IsString({ message: 'La description doit être une chaîne de caractères'})
    @IsNotEmpty({ message: 'La description est requise'})
    description: string;

    /**
     * Coordonnées géographiques du point d'attention.
     * Objet contenant les informations de localisation du point.
     * @required
     */
    @ApiProperty({ type: () => CreatePointDto })
    @Type(() => CreatePointDto)
    @ValidateNested({ message: 'Le point doit être valide'})
    point: CreatePointDto;
}
