import { UsersService } from './../users/users.service';
import { CreatePostInput } from './post.input';
import { GraphqlJwtAuthGuard } from './../authentication/guard/graphql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './service/posts.service';
import RequestWithUser from '../authentication/interface/requestWithUser.interface';
import User from 'src/users/entity/users.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();
    return posts.items;
  }
  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    return this.postsService.createPost(createPostInput, context.req.user);
  }
}
