import { FilterQuery, Model, ProjectionType } from 'mongoose';

type Result<T> = Promise<T | null>;

class MongoRepository<T extends Document> {
  constructor(
    protected readonly repository: Model<T>,
    protected readonly populateOnFind: string[] = [],
  ) {}

  async get(
    filter: FilterQuery<T>,
    proj?: Record<string, any>,
  ): Promise<T | null> {
    const options = { ...proj };
    return this.repository.findOne(filter, options).exec();
  }
  getAll(filter: FilterQuery<T>): Promise<T[] | null> {
    return this.repository.find(filter).exec();
  }
  create(item: T): Promise<T | null> {
    return this.repository.create(item);
  }

  update(id: string, item: T): void {
    throw new Error('Method not implemented.');
  }
}
