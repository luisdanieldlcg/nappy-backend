import { PropOptions } from '@nestjs/mongoose';
import { Result } from 'oxide.ts/dist';
import { RepositoryError } from './errors/repository.error';

export type SchemaRule = PropOptions<any>;
export type Projection = Record<string, any>;
export type RepositoryResult<T> = Promise<Result<T, RepositoryError>>;
