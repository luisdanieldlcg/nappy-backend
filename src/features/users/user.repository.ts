import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { object } from 'joi';
import { FilterQuery, Model } from 'mongoose';
import { SignupDTO } from 'src/features/auth/dtos/signup_dto';
import { DuplicateDatabaseKey } from 'src/common/exceptions/duplicate-database-key.exception';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  public async create(user: SignupDTO): Promise<User | null> {
    try {
      const model = new this.user(user);
      const output = await model.save();
      return output;
    } catch (error) {
      if (!(error instanceof Error)) {
        return null;
      }
      if (error.name.includes('Mongo') && error.message.indexOf('11000')) {
        throw new DuplicateDatabaseKey(error.message);
      }
      return null;
    }
  }

  public async findOne(
    filter: FilterQuery<User>,
    select?: any,
  ): Promise<UserDocument> {
    return this.user.findOne(filter).select(select);
  }

  public async findById(id: any, matcher: object): Promise<UserDocument> {
    return this.findOne({
      _id: id,
      ...matcher,
    });
  }
}
