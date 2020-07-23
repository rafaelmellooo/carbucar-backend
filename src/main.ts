import { static as staticfiles } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads', staticfiles(resolve(__dirname, '..', 'tmp', 'uploads')));
  await app.listen(3333);
}
bootstrap();
