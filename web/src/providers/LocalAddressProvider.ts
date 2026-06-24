import AbstractProvider from 'leaflet-geosearch/lib/providers/provider.js';
import type {
  EndpointArgument,
  ParseArgument,
  SearchResult,
} from 'leaflet-geosearch/lib/providers/provider.js';

export interface LocalRawResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export default class LocalAddressProvider extends AbstractProvider<
  LocalRawResult[],
  LocalRawResult
> {
  searchUrl: string;

  constructor(searchUrl: string) {
    super();
    this.searchUrl = searchUrl;
  }

  endpoint({ query }: EndpointArgument): string {
    return `${this.searchUrl}?q=${encodeURIComponent(String(query))}`;
  }

  parse({ data }: ParseArgument<LocalRawResult[]>): SearchResult<LocalRawResult>[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((raw) => ({
      x: Number(raw.lon),
      y: Number(raw.lat),
      label: raw.display_name,
      bounds: null,
      raw,
    }));
  }
}
