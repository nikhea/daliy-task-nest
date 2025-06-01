/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Todos API')
    .setDescription('A simple todos API built with NestJS and Zod')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.yourdomain.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    // .addGlobalResponse({
    //   status: 400,
    //   description: 'Bad request',
    // })
    // .addGlobalResponse({
    //   status: 401,
    //   description: 'Unauthorized',
    // })
    // .addGlobalResponse({
    //   status: 403,
    //   description: 'Forbidden',
    // })
    // .addGlobalResponse({
    //   status: 404,
    //   description: 'Not found',
    // })
    // .addGlobalResponse({
    //   status: 405,
    //   description: 'Method not allowed',
    // })
    // .addGlobalResponse({
    //   status: 409,
    //   description: 'Conflict',
    // })
    // .addGlobalResponse({
    //   status: 422,
    //   description: 'Unprocessable entity',
    // })
    // .addGlobalResponse({
    //   status: 429,
    //   description: 'Too many requests',
    // })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger documentation: http://localhost:3000/api');
}
void bootstrap();
