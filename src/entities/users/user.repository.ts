import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType } from 'mongoose';
import { User, UserDocument } from './schema';
import { Future } from 'src/common/types';
import { MongoDBRepository } from 'src/database/repository/impl/mongo.repository-impl';
import { IUserRepository } from 'src/database/repository/user.repository';
import { databaseConstants } from 'src/common/constants';

type T = UserDocument;

@Injectable()
export class UserRepositoryImpl
  extends MongoDBRepository<T>
  implements IUserRepository
{
  constructor(@InjectModel(User.name) private readonly _: Model<T>) {
    super(_, {
      populateOnFindOne: {
        path: databaseConstants.user.virtualFields.cardsPath,
      },
    });
  }
  public async findByEmail(email: string, proj?: ProjectionType<T>): Future<T> {
    return await this.findOne({ email }, proj);
  }
}
