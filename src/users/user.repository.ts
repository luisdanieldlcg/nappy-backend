import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SignupDTO } from 'src/auth/dtos/signup_dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  async create(user: SignupDTO): Promise<User> {
    const output = new this.user(user);
    await output.save();
    return output;
  }

  async findOne(
    filter: FilterQuery<User>,
    includeOrExclude: string,
  ): Promise<UserDocument> {
    return this.user.findOne(filter).select(includeOrExclude);
  }
}
