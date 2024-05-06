import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.useStaticAssets(path.join(__dirname, '../uploads'));
  await app.listen(5000);
}
bootstrap();
