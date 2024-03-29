import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { CoreRepository } from './repository';
// import { CoreRepository } from './repository.core';

export abstract class CoreService<T extends CoreRepository<any>> {
  constructor(protected readonly respository: T) {}

//   async create(data: any) {
//     return await this.respository.create(data);
//   }

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ) {
    return await this.respository.findOne(
      entityFilterQuery,
      projection,
      options,
    );
  }

  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
    options?: QueryOptions,
  ) {
    return await this.respository.find(entityFilterQuery, projection, options);
  }

  getRepository() {
    return this.respository;
  }

  async findOneAndUpdate(
    query: FilterQuery<T>,
    update: UpdateQuery<unknown>,
    options?: QueryOptions,
  ) {
    return await this.respository.findOneAndUpdate(query, update, options);
  }

  async updateOne(
    _id: string,
    data: UpdateQuery<unknown>,
    options: QueryOptions = {},
  ) {
    const updatedUser = await this.respository.findOneAndUpdate({ _id }, data, {
      ...options,
    });
    return updatedUser;
  }
}
