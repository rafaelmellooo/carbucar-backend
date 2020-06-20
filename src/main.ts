import { static as staticfiles } from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', staticfiles(resolve(__dirname, '..', 'tmp', 'uploads')));
  await app.listen(3333);
}
bootstrap();
