import {IsLatitude, IsLongitude, IsNotEmpty, IsNumber, Min} from "class-validator";

export class CreatePointDto {
    /**
     * Latitude du point.
     * Coordonnée géographique en degrés décimaux.
     * @required
     */
    @IsNotEmpty({ message: 'La latitude est requise'})
    @IsNumber({}, { message: 'La latitude doit être un nombre'})
    @IsLatitude({ message: 'La latitude doit être entre -90 et 90'})
    latitude: number;

    /**
     * Longitude du point.
     * Coordonnée géographique en degrés décimaux.
     * @required
     */
    @IsNotEmpty({ message: 'La longitude est requise'})
    @IsNumber({}, { message: 'La longitude doit être un nombre'})
    @IsLongitude({ message: 'La longitude doit être entre -180 et 180'})
    longitude: number;
}

export class CreateRankedPointDto extends CreatePointDto {
    /**
     * Rang du point.
     * Définit la position du point dans un ordre de classement. Doit être supérieur ou égal à 0.
     * @required
     */
    @IsNotEmpty({ message: 'Le rang du point est requis'})
    @IsNumber({}, { message: 'Le rang du point doit être un nombre'})
    @Min(0, { message: 'Le rang du point doit être supérieur ou égal à 0'})
    rank: number;
}
