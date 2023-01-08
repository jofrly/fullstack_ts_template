import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceConfig } from '../typeorm.config';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { Post } from './entities/post.entity';
import { SeedService } from './services/seed.service';
import { SeedController } from './controllers/seed.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceConfig),
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [
    PostController,
    SeedController,
  ],
  providers: [
    PostService,
    SeedService,
  ],
})
export class AppModule {}
