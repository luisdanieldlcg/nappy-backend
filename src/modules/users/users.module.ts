import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConstants } from 'src/common/constants';
import { userHooksFactory } from './user.hooks';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: databaseConstants.modelNames.user,
        useFactory: userHooksFactory,
      },
    ]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
