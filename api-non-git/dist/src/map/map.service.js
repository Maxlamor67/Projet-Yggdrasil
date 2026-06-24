"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapService = void 0;
const common_1 = require("@nestjs/common");
const Database = require("better-sqlite3");
let MapService = class MapService {
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
        if (this.tilesDb)
            this.tilesDb.close();
        if (this.addressesDb)
            this.addressesDb.close();
    }
    async findTile(z, x, y) {
        const stmt = this.tilesDb.prepare('SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?');
        const row = stmt.get(z, x, y);
        if (!row) {
            throw new common_1.NotFoundException();
        }
        return row.tile_data;
    }
    normalizeInput(input) {
        return input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }
    buildFtsQuery(text) {
        const terms = text.split(/\s+/);
        return terms
            .map((term, index) => {
            return index === terms.length - 1 ? `"${term}"*` : `"${term}"`;
        })
            .join(' AND ');
    }
    search(searchAddressDto) {
        const sanitizedInput = this.normalizeInput(searchAddressDto.q);
        if (sanitizedInput === '')
            return [];
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
            const exactResult = stmtExactMatch.all(this.buildFtsQuery(sanitizedInput));
            return exactResult.map((row) => {
                const name = row.city ??
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
                    licence: 'Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright',
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
        }
        catch (err) {
            return [];
        }
    }
};
exports.MapService = MapService;
exports.MapService = MapService = __decorate([
    (0, common_1.Injectable)()
], MapService);
//# sourceMappingURL=map.service.js.map