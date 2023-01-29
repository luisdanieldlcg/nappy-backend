import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/main.config';
import { ENV_FILES } from './config/env_files';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/filters/all-exceptions.filter';

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
        JWT_PRIVATE_KEY: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.required(),
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
