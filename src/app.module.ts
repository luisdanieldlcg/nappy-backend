import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptions/filters/all-exceptions.filter.js';
import { pino, mongoose } from './plugins';
import { AuthModule } from './features/auth/auth.module';
import { CardModule } from './features/card/card.module.js';
import { UserModule } from './features/user/user.module';
import EnvironmentConfig from './config/env.config.js';

@Module({
  imports: [
    EnvironmentConfig,
    LoggerModule.forRoot(pino),
    MongooseModule.forRootAsync(mongoose),
    AuthModule,
    CardModule,
    UserModule,
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
