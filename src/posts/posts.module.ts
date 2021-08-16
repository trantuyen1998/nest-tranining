import { UsersModule } from './../users/users.module';
import { CacheModule, Module } from '@nestjs/common';
import { PostsService } from './service/posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';
import PostSearchElasticService from './service/postSearchElastic.service';
import { SearchModule } from '../search/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PostsResolver } from './post.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    UsersModule,
    SearchModule,
    // Memory cache
    // CacheModule.register({
    //   ttl: 5,
    //   max: 100,
    // }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
  ],
  providers: [PostsService, PostSearchElasticService, PostsResolver],
  controllers: [PostsController],
})
export class PostsModule {}
