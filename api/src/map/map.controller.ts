import {Controller, Get, Param, Header, ParseIntPipe, Res, Query, HttpCode, HttpStatus} from '@nestjs/common';
import { MapService } from './map.service';
import {AllowAnonymous} from "@thallesp/nestjs-better-auth";
import {Response} from "express";
import {SearchAddressDto} from "./dto/search-address.dto";

/**
 * Contrôleur gérant les requêtes liées aux cartes et à la cartographie.
 * Fournit des endpoints pour récupérer des tuiles de carte et rechercher des adresses.
 */
@Controller('maps')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    /**
     * Récupère une tuile de carte au format PNG pour les coordonnées spécifiées.
     * Les tuiles sont mises en cache pendant 24 heures côté client.
     * Accessible sans authentification.
     *
     * @param z - Niveau de zoom de la tuile
     * @param x - Coordonnée X de la tuile
     * @param y - Coordonnée Y de la tuile
     * @param res - Objet pour envoyer la réponse
     * @returns Une image PNG représentant la tuile demandée
     */
    @AllowAnonymous()
    @Get('tiles/:z/:x/:y')
    @HttpCode(HttpStatus.OK)
    @Header('Cache-Control', 'public, max-age=86400')
    async findTile(
        @Param('z', ParseIntPipe) z: number,
        @Param('x', ParseIntPipe) x: number,
        @Param('y', ParseIntPipe) y: number,
        @Res() res: Response,
    ) {
        const tile = await this.mapService.findTile(z, x, y);
        res.setHeader('Content-Length', tile.length);
        res.setHeader('Content-Type', 'image/png');
        res.send(tile);
    }

    /**
     * Recherche des adresses selon les critères fournis.
     * Accessible sans authentification.
     *
     * @param searchAddressDto - Objet contenant les paramètres de recherche d'adresse
     * @returns Les résultats de recherche correspondant aux critères
     */
    @AllowAnonymous()
    @Get('search')
    @HttpCode(HttpStatus.OK)
    search(@Query() searchAddressDto: SearchAddressDto) {
        return this.mapService.search(searchAddressDto);
    }
}