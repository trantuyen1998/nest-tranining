import { Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';
import PostSearchElasticService from './service/postSearchElastic.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SearchModule],
  providers: [PostsService, PostSearchElasticService],
  controllers: [PostsController],
})
export class PostsModule {}
