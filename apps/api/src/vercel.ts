import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { Request, Response } from 'express';

let server: (req: Request, res: Response) => void;

export default async function handler(req: Request, res: Response) {
  if (!server) {
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

    await app.init();
    const instance = app.getHttpAdapter().getInstance() as unknown;
    server = instance as (req: Request, res: Response) => void;
  }
  return server(req, res);
}
