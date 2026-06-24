"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bodyParser: false,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '2',
    });
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    });
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Nidhoggr API')
            .setDescription('Nidhoggr API documentation')
            .setVersion('1.0')
            .build();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, documentFactory);
    }
    await app.listen(process.env.HTTP_PORT ?? 8000);
}
void bootstrap();
//# sourceMappingURL=main.js.map