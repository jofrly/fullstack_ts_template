import { NestApplication, NestFactory } from '@nestjs/core';
import { DataSource, Repository, UpdateDateColumn } from 'typeorm';
import { AppModule } from '../app.module';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';

interface PostOptions {
  title?: string;
  body?: string;
}

// TODO: extract to factory bot logic so it can be reused across specs and also for e2e test seeding
function buildPost(options: PostOptions = {}): Post {
  const post = new Post();
  post.title = options.title || 'Post title';
  post.body = options.body || 'Post body';

  return post;
}

async function createPost(postRepository: any, options: PostOptions = {}): Promise<Post> {
  const post = buildPost(options);
  await postRepository.save(post);

  return post;
}

describe('PostController', () => {
  let app: NestApplication;
  let controller: PostController;
  let dataSource: DataSource;
  let postsRepository: Repository<Post>;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    controller = app.get<PostController>(PostController);
    dataSource = app.get<DataSource>(DataSource);
    postsRepository = dataSource.getRepository(Post);

    // TODO: create logic to clear repositories for all entities (including future entities without having to manually add them somewhere)
    await postsRepository.clear();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      // arrange
      await createPost(postsRepository, { title: 'a', body: 'b' });
      await createPost(postsRepository, { title: 'c', body: 'some extra long body with more than twenty characters' });

      // act
      const result = await controller.findAll();

      // assert
      expect(result).toEqual([
        { title: 'a', body: 'b' },
        { title: 'c', body: 'some extra long b...' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return all posts', async () => {
      // arrange
      const post = await createPost(postsRepository, { title: 'Post title', body: 'some extra long body with more than twenty characters' });

      // act
      const result = await controller.findOne(post.id.toString());

      // assert
      expect(result).toEqual({
        title: 'Post title',
        body: 'some extra long body with more than twenty characters'
      });
    });

    // TODO: test 404
  });

  describe('remove', () => {
    it('should delete post', async () => {
      // arrange
      const post = await createPost(postsRepository);

      // act
      await controller.remove(post.id.toString());

      // assert
      expect(await postsRepository.find()).toEqual([]);
    });

    // TODO: test 404
  });

  describe('create', () => {
    it('should create a post', async () => {
      // arrange
      const createPostDto: CreatePostDto = {
        title: 'post title',
        body: 'post body',
      };

      // act
      await controller.create(createPostDto);

      // assert
      const posts = await postsRepository.find();
      expect(posts.length).toBe(1);

      const post = posts[0];
      expect(post.title).toEqual('post title');
      expect(post.body).toEqual('post body');
    });

    // TODO: validate presence of title and body
  });

  describe('update', () => {
    it('should update a post', async () => {
      // arrange
      const postToUpdate = await createPost(postsRepository, { title: 'old post title', body: 'old post body' });
      const updatePostDto: UpdatePostDto = {
        title: 'new post title',
        body: 'new post body',
      };

      // act
      await controller.update(postToUpdate.id.toString(), updatePostDto);

      // assert
      const posts = await postsRepository.find();
      expect(posts.length).toBe(1);

      const post = posts[0];
      expect(post.title).toEqual('new post title');
      expect(post.body).toEqual('new post body');
    });

    // TODO: test 404 & validate presence of title and body
  });
});
