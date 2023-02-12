import { FilterQuery, Model } from 'mongoose';
import { Err, Ok } from 'oxide.ts';
import { EntityDTO } from 'src/common/dto/entity-dto';
import { Future } from 'src/common/types';
import { IMongoDBRepository } from '../repository';
import {
  RepositoryError,
  RepositoryErrorKind,
} from 'src/common/errors/repository.error';

export abstract class MongoDBRepository<M, D extends EntityDTO>
  implements IMongoDBRepository<M>
{
  constructor(protected readonly entity: Model<M>) {}

  async create(dto: D): Future<M> {
    try {
      const instance = new this.entity(dto);
      const result = await this.entity.create(instance);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  async find(id: string): Future<M> {
    try {
      const result = await this.entity.findById(id);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }
  async findOne(filter: FilterQuery<M>): Future<M> {
    try {
      const result = await this.entity.findOne(filter);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }
  async findAll(): Future<M[]> {
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
