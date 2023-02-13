import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptions/filters/all-exceptions.filter.js';
import { CardsModule } from './entities/cards/cards.module';
import { UsersModule } from './entities/users/users.module.js';
import { pino, config, mongoose, router } from './plugins';
const plugins = [
  LoggerModule.forRoot(pino),
  ConfigModule.forRoot(config),
  MongooseModule.forRootAsync(mongoose),
  RouterModule.register(router),
];
@Module({
  imports: [...plugins, AuthModule, CardsModule, UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
