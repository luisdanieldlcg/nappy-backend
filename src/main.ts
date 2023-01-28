import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 3001;
  await app.listen(port);
}
bootstrap();
