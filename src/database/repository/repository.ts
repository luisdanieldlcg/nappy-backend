import { FilterQuery, ProjectionType, SaveOptions } from 'mongoose';
import { Future } from 'src/common/types';

export abstract class IMongoDBRepository<T extends Document> {
  abstract create(dto: object, options?: SaveOptions): Future<T>;
  /**
   * Find one document by its Identifier.
   * @param filter
   */
  abstract find(id: string, proj?: ProjectionType<T>): Future<T>;

  abstract findOne(filter: FilterQuery<T>, proj?: ProjectionType<T>): Future<T>;

  abstract findAll(): Future<T[]>;
}
