import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { ENV_FILES } from './config/env_files';

import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
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
  providers: [],
})
export class AppModule {}
