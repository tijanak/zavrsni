import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { environment } from '@dog-finder/environment';

import cookieParser from 'cookie-parser';
import { AppModule } from './modules/app/app.module';
import { exceptionFactory } from './validation/exception-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });
  const port = environment.PORT || 3000;
  app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: exceptionFactory,
    })
  );
  app.use(cookieParser());
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
