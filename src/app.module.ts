import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptions/filters/all-exceptions.filter.js';

import { pino, config, mongoose } from './plugins';
import { AuthModule } from './features/auth/auth.module.js';
import { CardModule } from './features/card/card.module.js';
import { UserModule } from './features/user/user.module.js';
const plugins = [
  LoggerModule.forRoot(pino),
  ConfigModule.forRoot(config),
  MongooseModule.forRootAsync(mongoose),
  // RouterModule.register(router),
];
@Module({
  imports: [...plugins, AuthModule, CardModule, UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
