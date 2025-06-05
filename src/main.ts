/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './setup/swagger-setup';
import { setupLogInit } from './setup/initLog-setup';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    abortOnError: false,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT')!;
  const api_version = configService.get<string>('API_VERSION')!;

  const server_url = `http://localhost:${port}`;

  app.disable('x-powered-by');
  app.setGlobalPrefix(api_version);
  app.set('trust proxy', 'loopback');
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(new ZodValidationPipe());

  setupSwagger(app, api_version, server_url);

  await app.listen(port);
  setupLogInit(server_url, api_version);
}
void bootstrap();
