import { DataSource } from 'typeorm';
import { Post } from '../../src/post/entities/post.entity';

export async function purgeDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}

export class FactoryBot {
  static dataSource: DataSource;
  static factories = {};

  static define(name: string, entity: any, options: any): void {
    this.factories[name] = {
      name,
      entity,
      options,
    };
  }

  static async create(name: string, options: any = {}): Promise<any> {
    const factory = this.factories[name];
    const object = new factory.entity();

    for (const key in factory.options) {
      if (factory.options.hasOwnProperty(key)) {
        object[key] = options[key] || factory.options[key]();
      }
    }

    await this.dataSource.getRepository(factory.entity).save(object);

    return object;
  }
}

FactoryBot.define('post', Post, {
  title: () => 'Post title',
  body: () => 'Post body',
});