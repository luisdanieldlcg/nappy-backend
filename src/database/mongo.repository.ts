import { FilterQuery, Model } from 'mongoose';

type Result<T> = Promise<T | null>;

export abstract class MongoRepository<T extends Document> {
  constructor(
    protected readonly repository: Model<T>,
    protected readonly populateOnFind: string[] = [],
  ) {}

  public async get(
    filter: FilterQuery<T>,
    proj?: Record<string, any>,
  ): Result<T> {
    const options = { ...proj };
    return this.repository.findOne(filter, options).exec();
  }

  public async getById(id: any, proj?: Record<string, any>): Result<T> {
    return this.repository.findById(id, proj).exec();
  }
  public async getAll(
    filter: FilterQuery<T>,
    proj?: Record<string, any>,
  ): Result<T[]> {
    return this.repository.find(filter, proj).exec();
  }

  /**
   * Create a new entity.
   * @returns Either the new Entity or a server error
   */
  public async create(item: T): Result<T> {
    return this.repository.create(item);
  }
}
