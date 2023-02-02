import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { addAllHooks } from './user.hooks';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: addAllHooks,
      },
    ]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
