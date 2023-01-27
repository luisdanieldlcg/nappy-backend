import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { injectAllHooks } from './user.hooks';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: injectAllHooks,
      },
    ]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
