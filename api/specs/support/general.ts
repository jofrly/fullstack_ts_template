import { DataSource } from 'typeorm';
import { Post } from '../../src/post/entities/post.entity';

export interface PostOptions {
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

export async function purgeDatabase(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
}