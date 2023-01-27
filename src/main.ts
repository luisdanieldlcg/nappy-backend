import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 3001;

  await app.listen(port);

  const logger = new Logger('boostrap');
  logger.log(`Listening on ${await app.getUrl()}`);
}
bootstrap();
