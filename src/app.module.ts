import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { ENV_FILES } from './config/env_files';

import Joi from 'joi';

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
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
