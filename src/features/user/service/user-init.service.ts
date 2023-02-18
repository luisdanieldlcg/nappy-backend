import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LocalSignupDTO } from '../../auth/dtos';
import { User } from '../schema';

@Injectable()
export class UserInitializerService implements OnModuleInit {
  constructor(@InjectModel(User.name) protected readonly model: Model<User>) {}
  public async onModuleInit() {
    console.log('(UserModule) Initializing');
    const user: LocalSignupDTO = {
      email: 'admin@example.com',
      password: 'admin',
      passwordConfirm: 'admin',
    };
    await this.model.deleteMany({});
    await this.model.create(user).then((data) => console.log(data));
  }
}
