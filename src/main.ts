import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: [configService.get<string>('CLIENT_URL') as string],
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}
bootstrap();
