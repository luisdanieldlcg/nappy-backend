import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { SignupDTO } from 'src/modules/auth/dtos/signup_dto';
import { DuplicateDatabaseKey } from 'src/common/exceptions/duplicate-database-key.exception';
import { User, UserDocument } from './schema';
import { MongoRepository } from 'src/database/mongo.repository';

@Injectable()
export class UserRepository extends MongoRepository<UserDocument> {
  constructor(@InjectModel(User.name) readonly userModel: Model<UserDocument>) {
    super(userModel);
  }
}
