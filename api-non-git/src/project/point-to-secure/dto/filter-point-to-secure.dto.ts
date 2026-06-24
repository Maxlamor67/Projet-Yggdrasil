export class FilterPointToSecureDto {
  // Filtre par type
  type?: string;

  // Zone géographique
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
}
