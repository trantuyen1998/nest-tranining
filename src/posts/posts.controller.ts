import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/authentication/guard/jwt-two-factor.guard';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import FindOneParams from '../utils/type/findOneParams';
import { PaginationParams } from './../utils/type/paginationParams';
import { GET_POSTS_CACHE_KEY } from './constants/postsCacheKey.constant';
import CreatePostDto from './dto/createPost.dto';
import { HttpCacheInterceptor } from './interceptors/httpCache.Interceptor';
import { PostsService } from './service/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  async getPosts(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchElasticForPosts(
        search,
        offset,
        limit,
        startId,
      );
    }
    return this.postsService.getAllPosts(offset, limit, startId);
  }

  @Delete(':id')
  async removePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
