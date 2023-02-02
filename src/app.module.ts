import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './modules/auth/auth.module.js';
import databaseConfig from './config/main.config.js';
import { ENV_FILES } from './config/env_files.js';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptions/filters/all-exceptions.filter.js';
import { CardsModule } from './modules/cards/cards.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Allow config module everywhere
      envFilePath: ENV_FILES[process.env.NODE_ENV] || '.env',
      load: [databaseConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'debug', 'production')
          .default('development'),
        PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        TOKEN_PRIVATE_KEY: Joi.string().required(),
        ACCESS_TOKEN_EXPIRES_IN: Joi.required(),
        REFRESH_TOKEN_EXPIRES_IN: Joi.required(),
        TOKEN_COOKIE_EXPIRES_IN: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigType<typeof databaseConfig>) => {
        return {
          uri: config.DATABASE_URL,
        };
      },
      inject: [databaseConfig.KEY],
    }),
    AuthModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
