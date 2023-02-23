import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory(errors) {
      //   console.log(errors);
      //   throw new BadRequestException('Got an invalid value passed in');
      // },
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3000',
  });
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.use(morgan('dev'));
  const configService = app.get(ConfigService);
  const port = configService.get('SERVER_PORT') || 3001;
  await app.listen(port);
}
bootstrap();
