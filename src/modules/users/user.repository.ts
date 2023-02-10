import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema';
import { MongoDBRepository } from 'src/database/repository';
import { IUserRepository } from 'src/database/user.repository';
import { RepositoryResult } from 'src/common/types';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserRepositoryImpl
  extends MongoDBRepository<UserDocument, UserDTO>
  implements IUserRepository
{
  toDTO(entity: UserDocument): UserDTO {
    return {
      email: entity.email,
      accessToken: '',
      refreshToken: entity.refreshToken,
    };
  }

  constructor(@InjectModel(User.name) private readonly _: Model<UserDocument>) {
    super(_);
  }
  async findByEmail(email: string): RepositoryResult<UserDocument> {
    return await this.findOne({ email });
  }
}
