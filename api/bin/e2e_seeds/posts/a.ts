import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../src/app.module';
import { Post } from '../../../src/post/entities/post.entity';
import { DataSource, Repository } from 'typeorm';

interface PostOptions {
  title?: string;
  body?: string;
}

// TODO: extract to factory bot logic so it can be reused across specs and also for e2e test seeding
export function buildPost(options: PostOptions = {}): Post {
  const post = new Post();
  post.title = options.title || 'Post title';
  post.body = options.body || 'Post body';

  return post;
}

export async function createPost(
  postRepository: any,
  options: PostOptions = {},
): Promise<Post> {
  const post = buildPost(options);
  await postRepository.save(post);

  return post;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get<DataSource>(DataSource);
  const postsRepository = dataSource.getRepository(Post);

  await seedData(postsRepository);

  await app.close();
}
bootstrap();

async function seedData(postsRepository: Repository<Post>): Promise<void> {
  // TODO: create logic to clear repositories for all entities (including future entities without having to manually add them somewhere)
  await postsRepository.clear();

  await createPost(postsRepository, { title: 'first post title', body: 'first post body' });
  await createPost(postsRepository, { title: 'second post title', body: 'second post body' });
}
