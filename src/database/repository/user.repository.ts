import { Result } from 'oxide.ts/dist';
import { RepositoryError } from 'src/common/errors/repository.error';
import { UserDocument } from 'src/entities/users/schema';
import { IMongoDBRepository } from './repository';

export abstract class IUserRepository extends IMongoDBRepository<UserDocument> {
  abstract findByEmail(
    email: string,
  ): Promise<Result<UserDocument, RepositoryError>>;
}
