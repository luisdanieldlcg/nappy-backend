import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { object } from 'joi';
import {
  FilterQuery,
  Model,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { SignupDTO } from 'src/auth/dtos/signup_dto';
import { DuplicateDatabaseKey } from 'src/exceptions/duplicate-database-key.exception';
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

  public async findOne(filter: FilterQuery<User>): Promise<UserDocument> {
    return this.user.findOne(filter);
  }
  public async findOneAndSelect(
    filter: FilterQuery<User>,
    select: string | any,
  ): Promise<UserDocument> {
    return this.user.findOne(filter).select(select);
  }

  public async findById(id: any): Promise<UserDocument> {
    return this.user.findById(id);
  }
  public async findByIdAndMatch(
    id: any,
    matcher: object,
  ): Promise<UserDocument> {
    return this.findOne({
      _id: id,
      ...matcher,
    });
  }
}
