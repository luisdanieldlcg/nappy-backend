import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return this.user.findOne(filter);
  }

  async create(user: User): Promise<User> {
    const output = new this.user(user);
    await output.save();
    return output;
  }
}
