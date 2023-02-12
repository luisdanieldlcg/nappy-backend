import { ProjectionType } from 'mongoose';
import { Future } from 'src/common/types';
import { UserDocument } from 'src/entities/users/schema';
import { IMongoDBRepository } from './repository';

type T = UserDocument;
export abstract class IUserRepository extends IMongoDBRepository<T> {
  abstract findByEmail(email: string, proj?: ProjectionType<T>): Future<T>;
}
