import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entity/users.entity';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import CreatePostDto from '../dto/createPost.dto';
import UpdatePostDto from '../dto/updatePost.dto';
import PostNotFoundException from '../exception/postNotFound.exception';
import Post from '../post.entity';
import PostSearchElasticService from './postSearchElastic.service';
import { Cache } from 'cache-manager';
import { GET_POSTS_CACHE_KEY } from '../constants/postsCacheKey.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchElasticService: PostSearchElasticService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }
    const [items, count] = await this.postsRepository.findAndCount({
      where,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    return {
      items,
      count: startId ? separateCount : count,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id, {
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    try {
      await this.postsRepository.save(newPost);
      // await this.postsSearchElasticService.indexPost(newPost);
      // clear cache when create
      await this.clearCache();
      return newPost;
    } catch (error) {
      console.log('error when add post', error);
    }
  }

  async searchElasticForPosts(
    text: string,
    offset?: number,
    limit?: number,
    startId?: number,
  ) {
    const { results, count } = await this.postsSearchElasticService.searchPost(
      text,
      offset,
      limit,
      startId,
    );
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.postsRepository.find({
      where: {
        id: In(ids),
      },
    });
    return {
      items,
      count,
    };
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchElasticService.removePost(id);
    await this.clearCache();
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const postUpdate = await this.postsRepository.findOne(id, {
      relations: ['author'],
    });
    if (postUpdate) {
      await this.postsSearchElasticService.updatePost(postUpdate);
      await this.clearCache();
      return postUpdate;
    }
    throw new PostNotFoundException(id);
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository.query(
      'SELECT * from post WHERE $1 = ANY(paragraphs)',
      [paragraph],
    );
  }

  /**
   * Handle clear cache use when CRUD
   */
  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }
}
