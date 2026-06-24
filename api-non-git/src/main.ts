import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe, VersioningType} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
        .setTitle('Nidhoggr API')
        .setDescription('Nidhoggr API documentation')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(
        app,
        config,
    );
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(process.env.HTTP_PORT ?? 8000);
}
void bootstrap();
