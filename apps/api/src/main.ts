import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const port = Number(process.env.PORT ?? 4000);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CRUD API')
    .setDescription('Dokumentasi API Blog')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  app.enableCors(corsOptions);
  console.log(
    'CORS enabled: allow all origins; methods GET,HEAD,PUT,PATCH,POST,DELETE',
  );

  await app.listen(port);
  console.log(`your aplikasi runing in http://localhost:${port}`);
  console.log(`Public API accessible at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
void bootstrap();
