import { IsOptional, IsString } from 'class-validator';

export class SearchAddressDto {
  /**
   * Terme de recherche pour l'adresse.
   * Peut contenir une adresse partielle ou complète à rechercher.
   * @optional
   */
  @IsOptional()
  @IsString({ message: 'Le terme de recherche doit être une chaîne de caractères'})
  q?: string;

  /**
   * Format de la réponse souhaitée.
   * Permet de spécifier le format des résultats retournés (ex: json, xml).
   * @optional
   */
  @IsOptional()
  @IsString({ message: 'Le format doit être une chaîne de caractères'})
  format?: string;
}
