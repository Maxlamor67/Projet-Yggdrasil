import {Injectable, NotFoundException, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import * as Database from 'better-sqlite3';
import {SearchAddressDto} from "./dto/search-address.dto";
import {SearchResult} from "../utils/types/search-result";

interface AddressRecord {
    id: number;
    lat: number;
    lon: number;
    number: string;
    rep: string | null;
    street: string;
    city: string;
    postcode: string;
}

@Injectable()
export class MapService implements OnModuleInit, OnModuleDestroy {
    private tilesDb: Database.Database;
    private addressesDb: Database.Database;

    onModuleInit() {
        this.tilesDb = new Database('./assets/map.mbtiles', {
            readonly: true,
            fileMustExist: true
        });

        this.addressesDb = new Database('assets/alsace.db', {
            readonly: true,
            fileMustExist: true,
        });
    }

    onModuleDestroy() {
        if (this.tilesDb) this.tilesDb.close();
        if (this.addressesDb) this.addressesDb.close();
    }

    async findTile(z: number, x: number, y: number) {
        const stmt = this.tilesDb.prepare(
            'SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?'
        );

        const row = stmt.get(z, x, y) as { tile_data: Buffer } | undefined;

        if (!row) {
            throw new NotFoundException();
        }

        return row.tile_data;
    }

    private normalizeInput(input: string): string {
        return input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    private buildFtsQuery(text: string): string {
        const terms = text.split(/\s+/);
        return terms
            .map((term, index) => {
                return index === terms.length - 1 ? `"${term}"*` : `"${term}"`;
            })
            .join(' AND ');
    }

    public search(searchAddressDto: SearchAddressDto): SearchResult[] {
        const sanitizedInput = this.normalizeInput(searchAddressDto.q);
        if (sanitizedInput === '') return [];

        try {
            const stmtExactMatch = this.addressesDb.prepare(`
                SELECT id,
                       number,
                       rep,
                       street,
                       postcode,
                       city,
                       lat,
                       lon,
                       rank
                FROM addresses_fts
                WHERE search_content MATCH ?
                ORDER BY rank
                LIMIT 20
            `);
            const exactResult = stmtExactMatch.all(this.buildFtsQuery(sanitizedInput)) as AddressRecord[];

            return exactResult.map((row) => {
                const name =
                    row.city ??
                    row.street ??
                    null;

                const addressNumberParts = [
                    row.number,
                    row.rep,
                ]
                    .filter(Boolean)
                    .join('');

                const displayName = [
                    `${addressNumberParts} ${row.street}`.trim(),
                    row.postcode,
                    row.city,
                ]
                    .filter(Boolean)
                    .join(', ');

                return {
                    place_id: row.id,

                    licence:
                        'Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright',

                    osm_type: null,
                    osm_id: null,

                    lat: String(row.lat),
                    lon: String(row.lon),

                    class: null,
                    type: null,

                    place_rank: null,
                    importance: null,

                    addresstype: null,
                    name,

                    display_name: displayName,

                    boundingbox: null,
                };
            });
        } catch (err) {
            return [];
        }
    }
}