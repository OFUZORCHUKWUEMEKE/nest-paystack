import {
    Document,
    FilterQuery,
    Model,
    PopulateOptions,
    QueryOptions,
    UpdateQuery,
  } from 'mongoose';
  
  export abstract class CoreRepository<T extends Document> {
    constructor(protected readonly entityModel: Model<T>) {}
  
    async findOne(
      entityFilterQuery: FilterQuery<T>,
      projection?: Record<string, unknown>,
      options?: QueryOptions,
    ): Promise<T | null> {
      return this.entityModel
        .findOne(
          entityFilterQuery,
          {
            __v: 0,
            ...projection,
          },
          options,
        )
        .exec();
    }
  
    async find(
      entityFilterQuery: FilterQuery<T>,
      projection?: Record<string, unknown>,
      options?: QueryOptions,
    ): Promise<T[]> {
      return this.entityModel.find(entityFilterQuery, projection, options);
    }
  
    async create(data) {
      const document = new this.entityModel(data);
      return await document.save();
  }

    async createMany(createEntityData: unknown): Promise<T> {
      return this.entityModel.create(createEntityData);
    }
  
    async findOneAndUpdate(
      entityFilterQuery: FilterQuery<T>,
      updateEntityData: UpdateQuery<unknown>,
      options: QueryOptions,
    ): Promise<T | null> {
      return this.entityModel.findOneAndUpdate(
        entityFilterQuery,
        updateEntityData,
        {
          new: true,
          ...options,
        },
      );
    }
  
    async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
      const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
      return deleteResult.deletedCount >= 1;
    }
  
    newDocument<D>(data: D): T {
      return new this.entityModel(data);
    }
  
    model(): Model<T> {
      return this.entityModel;
    }
  
    async save(entity: any, options?: QueryOptions): Promise<T> {
      return entity.save(options);
    }
  
    async saveData(
      entity: Record<string, any>,
      options?: QueryOptions,
    ): Promise<T> {
      return this.newDocument(entity).save(options);
    }
  
    async populate(
      entity: any,
      path?: string | PopulateOptions | (string | PopulateOptions)[],
    ): Promise<T> {
      return entity.populate(path);
    }
  }
  