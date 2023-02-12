import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { databaseConstants } from 'src/common/constants';
import { IUserRepository } from 'src/database/repository/user.repository';
import { userHooksFactory } from './user.hooks';
import { UserRepositoryImpl } from './user.repository';
import { UserService } from './user.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: databaseConstants.user.name,
        useFactory: userHooksFactory,
      },
    ]),
  ],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
  ],

  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
