import {
  Controller,
  Get,
  Post as PostMethod,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostReadModel } from './read_models/post';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @PostMethod()
  create(@Body() createPostDto: CreatePostDto): Promise<void> {
    return this.postService.create(createPostDto);
  }

  @Get()
  findAll(): Promise<PostReadModel[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostReadModel> {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<void> {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.postService.remove(+id);
  }
}
