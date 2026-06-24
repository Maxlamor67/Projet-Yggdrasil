import {CreatePointToSecureDto} from "../../point-to-secure/dto/create-point-to-secure.dto";
import {ApiProperty, OmitType} from "@nestjs/swagger";
import {IsArray, IsJSON, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";

export class CreatePointToSecureTransferDto extends OmitType(CreatePointToSecureDto, ['isTreated']) {
    /**
     * Index du point dans la séquence.
     * Définit la position du point dans l'ordre de traitement du transfert.
     * @required
     */
    @IsNumber({}, { message: 'L\'index doit être un nombre'})
    @IsNotEmpty({ message: 'L\'index est requis'})
    index: number;
}

export class ImportDataDto {
    /**
     * Liste des points à sécuriser.
     * Tableau contenant les points à importer avec leurs informations et leur index.
     * @required
     */
    @ApiProperty({ type: () => CreatePointToSecureDto, isArray: true })
    @IsNotEmpty({ message: 'Les points à sécuriser sont requis'})
    @IsArray({ message: 'Les points à sécuriser doivent être un tableau'})
    @ValidateNested({ each: true, message: 'Chaque point doit être valide'})
    pointsToSecure: CreatePointToSecureTransferDto[];
}

export class ImportRawDataDto {
    /**
     * Données JSON brutes.
     * Chaîne de caractères contenant les données à importer au format JSON.
     * @required
     */
    @IsJSON({ message: 'Les données doivent être au format JSON valide'})
    @IsNotEmpty({ message: 'Les données sont requises'})
    data: string;
}
