export interface SearchResult {
    place_id: number;
    licence: string;
    osm_type: string | null;
    osm_id: number | null;
    lat: string;
    lon: string;
    class: string | null;
    type: string | null;
    place_rank: number | null;
    importance: number | null;
    addresstype: string | null;
    name: string | null;
    display_name: string;
    boundingbox: [string, string, string, string] | null;
}
