import {Controller, Get, HttpCode, HttpStatus, Version, VERSION_NEUTRAL} from '@nestjs/common';
import {AppService} from './app.service';


/**
 * Contrôleur principal de l'application.
 * Fournit des endpoints généraux pour l'application.
 */
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    /**
     * Récupère l'adresse IP du serveur.
     *
     * @returns L'adresse IP du serveur
     */
    @Version(VERSION_NEUTRAL)
    @Get('ip')
    @HttpCode(HttpStatus.OK)
    getIpAddress() {
        return this.appService.getIpAddress();
    }

    @Version(VERSION_NEUTRAL)
    @Get('')
    @HttpCode(HttpStatus.OK)
    ok() {
        return "Hello World!";
    }
}
