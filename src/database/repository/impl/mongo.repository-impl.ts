import { FilterQuery, Model, ProjectionType } from 'mongoose';
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

  public async create(dto: D): Future<M> {
    try {
      const instance = new this.entity(dto);
      const result = await this.entity.create(instance);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  public async find(id: string, proj?: ProjectionType<M>): Future<M> {
    try {
      const result = await this.entity.findById(id, proj);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  public async findOne(
    filter: FilterQuery<M>,
    proj?: ProjectionType<M>,
  ): Future<M> {
    try {
      const result = await this.entity.findOne(filter, proj);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  public async findAll(): Future<M[]> {
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
