import { FilterQuery, ProjectionType } from 'mongoose';
import { EntityDTO } from 'src/common/dto/entity-dto';
import { Future } from 'src/common/types';

export abstract class IMongoDBRepository<T> {
  abstract create(dto: EntityDTO): Future<T>;
  /**
   * Find one document by its Identifier.
   * @param filter
   */
  abstract find(id: string, proj?: ProjectionType<T>): Future<T>;

  abstract findOne(filter: FilterQuery<T>, proj?: ProjectionType<T>): Future<T>;

  abstract findAll(): Future<T[]>;
}
