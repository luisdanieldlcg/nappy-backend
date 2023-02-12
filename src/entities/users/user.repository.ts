import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { User, UserDocument } from './schema';
import { Future } from 'src/common/types';
import { UserDTO } from './dto';
import { MongoDBRepository } from 'src/database/repository/impl/mongo.repository-impl';
import { IUserRepository } from 'src/database/repository/user.repository';

type T = UserDocument;

@Injectable()
export class UserRepositoryImpl
  extends MongoDBRepository<T, UserDTO>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) private readonly _: Model<T>) {
    super(_);
  }
  public async findByEmail(email: string, proj?: ProjectionType<T>): Future<T> {
    return await this.findOne({ email }, proj);
  }
}
