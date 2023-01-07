import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostReadModel } from './read_models/post';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    const post = new Post();
    post.title = createPostDto.title;
    post.body = createPostDto.body;

    await this.postsRepository.save(post);

    return;
  }

  async findAll(): Promise<PostReadModel[]> {
    const posts = await this.postsRepository.find();

    return posts.map(post => ({
      title: post.title,
      body: post.previewBody,
    }));
  }

  async findOne(id: number): Promise<PostReadModel|null> {
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      return null;
    }

    return {
      title: post.title,
      body: post.body,
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      return;
    }

    post.title = updatePostDto.title;
    post.body = updatePostDto.body;

    await this.postsRepository.save(post);

    return;
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);

    return;
  }
}
