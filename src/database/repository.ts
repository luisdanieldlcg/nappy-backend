import { FilterQuery, Model } from 'mongoose';
import { Ok, Result, Err } from 'oxide.ts';
import { EntityDTO } from 'src/common/dto/entity-dto';

import {
  RepositoryError,
  RepositoryErrorKind,
} from 'src/common/errors/repository.error';

type RepositoryResult<T> = Promise<Result<T, RepositoryError>>;

export abstract class IMongoDBRepository<T> {
  abstract create(dto: EntityDTO): RepositoryResult<T>;
  /**
   * Find one document by its Identifier.
   * @param filter
   */
  abstract find(id: string): RepositoryResult<T>;

  abstract findOne(filter: FilterQuery<T>): RepositoryResult<T>;
  abstract findAll(): RepositoryResult<T[]>;
}

export abstract class MongoDBRepository<M, D extends EntityDTO>
  implements IMongoDBRepository<M>
{
  constructor(protected readonly entity: Model<M>) {}

  abstract toDTO(entity: M): D;

  async create(dto: D): RepositoryResult<M> {
    try {
      const result = await this.entity.create(dto);
      // const entityToDTO = this.toDTO(result);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  async find(id: string): RepositoryResult<M> {
    try {
      const result = await this.entity.findById(id);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }
  async findOne(filter: FilterQuery<M>): RepositoryResult<M> {
    try {
      const result = await this.entity.findOne(filter);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }
  async findAll(): RepositoryResult<M[]> {
    try {
      const result = await this.entity.find();
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  handleRepositoryError(e: any): RepositoryError {
    return new RepositoryError(
      'Could not create the entity',
      RepositoryErrorKind.INTERNAL_ERROR,
    );
  }
}
