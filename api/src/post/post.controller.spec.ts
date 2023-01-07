import { NestApplication, NestFactory } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { FactoryBot, purgeDatabase } from '../../specs/support/general';
import { AppModule } from '../app.module';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';

describe('PostController', () => {
  let app: NestApplication;
  let controller: PostController;
  let postsRepository: Repository<Post>;

  beforeEach(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    controller = app.get<PostController>(PostController);
    const dataSource = app.get<DataSource>(DataSource);
    postsRepository = dataSource.getRepository(Post);

    FactoryBot.dataSource = dataSource;
    purgeDatabase(dataSource);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      // arrange
      await FactoryBot.create('post', { title: 'a', body: 'b' });
      await FactoryBot.create('post', {
        title: 'c',
        body: 'some extra long body with more than twenty characters',
      });

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
      const post = await FactoryBot.create('post', {
        title: 'Post title',
        body: 'some extra long body with more than twenty characters',
      });

      // act
      const result = await controller.findOne(post.id.toString());

      // assert
      expect(result).toEqual({
        title: 'Post title',
        body: 'some extra long body with more than twenty characters',
      });
    });

    // TODO: test 404
  });

  describe('remove', () => {
    it('should delete post', async () => {
      // arrange
      const post = await FactoryBot.create('post');

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
      const postToUpdate = await FactoryBot.create('post', {
        title: 'old post title',
        body: 'old post body',
      });
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
