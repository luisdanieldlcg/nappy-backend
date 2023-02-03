import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schema';
import { MongoRepository } from 'src/database/mongo.repository';
import { UserProjections } from 'src/config/projection.config';

@Injectable()
export class UserRepository extends MongoRepository<UserDocument> {
  constructor(@InjectModel(User.name) readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  public getAll(
    filter: FilterQuery<UserDocument>,
    proj?: Record<string, any>,
  ): Promise<UserDocument[]> {
    const defaultProjection = {
      ...UserProjections.default,
      ...proj,
    };
    return super.getAll(filter, defaultProjection);
  }

  public getById(id: any, proj?: Record<string, any>): Promise<UserDocument> {
    const defaultProjection = {
      ...UserProjections.default,
      ...proj,
    };
    return super.getById(id, defaultProjection);
  }
}
