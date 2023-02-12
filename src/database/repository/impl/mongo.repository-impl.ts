import {
  FilterQuery,
  Model,
  PopulateOptions,
  ProjectionType,
  SaveOptions,
} from 'mongoose';
import { Err, Ok } from 'oxide.ts';
import { Future } from 'src/common/types';
import { IMongoDBRepository } from '../repository';
import {
  RepositoryError,
  RepositoryErrorKind,
} from 'src/common/errors/repository.error';

type RepositoryOptions = {
  populateOnFindOne?: PopulateOptions;
  populateOnFindAll?: PopulateOptions;
};
export abstract class MongoDBRepository<M extends Document>
  implements IMongoDBRepository<M>
{
  constructor(
    protected readonly entity: Model<M>,
    protected readonly opts: RepositoryOptions = {},
  ) {}

  public async create(dto: object, options?: SaveOptions): Future<M> {
    try {
      const instance = new this.entity(dto);
      const result = await instance.save(options);
      return Ok(result);
    } catch (e) {
      return Err(this.handleRepositoryError(e));
    }
  }

  public async find(id: string, proj?: ProjectionType<M>): Future<M> {
    try {
      const query = this.entity.findById(id, proj);
      const populate = this.opts.populateOnFindOne;
      if (populate) {
        query.populate({
          ...populate,
        });
      }
      return Ok(await query);
    } catch (e) {
      console.log({ e });
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
