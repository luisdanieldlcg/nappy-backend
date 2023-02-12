import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema';
import { Future } from 'src/common/types';
import { UserDTO } from './dto';
import { MongoDBRepository } from 'src/database/repository/impl/mongo.repository-impl';
import { IUserRepository } from 'src/database/repository/user.repository';

@Injectable()
export class UserRepositoryImpl
  extends MongoDBRepository<UserDocument, UserDTO>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) private readonly _: Model<UserDocument>) {
    super(_);
  }
  async findByEmail(email: string): Future<UserDocument> {
    return await this.findOne({ email });
  }
}
