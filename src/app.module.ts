import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceConfig } from '../typeorm.config';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { Post } from './post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceConfig),
    TypeOrmModule.forFeature([Post])
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class AppModule {}
