import { NestFactory } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';

import { AppModule } from '../../../src/app.module';
import { Post } from '../../../src/post/entities/post.entity';
import { createPost, purgeDatabase } from '../../../specs/support/general';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(DataSource);
  const postsRepository = dataSource.getRepository(Post);

  await purgeDatabase(dataSource);
  await seedData(postsRepository);

  await app.close();
}
bootstrap();

async function seedData(postsRepository: Repository<Post>): Promise<void> {
  await createPost(postsRepository, { title: 'first post title', body: 'first post body' });
  await createPost(postsRepository, { title: 'second post title', body: 'second post body' });
}
