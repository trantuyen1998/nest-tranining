import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/users/entity/users.entity';
import { In, Repository } from 'typeorm';
import CreatePostDto from '../dto/createPost.dto';
import UpdatePostDto from '../dto/updatePost.dto';
import PostNotFoundException from '../exception/postNotFound.exception';
import Post from '../post.entity';
import PostSearchElasticService from './postSearchElastic.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchElasticService: PostSearchElasticService,
  ) {}

  async getAllPosts() {
    return await this.postsRepository.find({ relations: ['author'] });
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
    await this.postsRepository.save(newPost);
    await this.postsSearchElasticService.indexPost(newPost);
    return newPost;
  }

  async searchElasticForPosts(text: string) {
    const result = await this.postsSearchElasticService.searchPost(text);
    const ids = result.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchElasticService.removePost(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const postUpdate = await this.postsRepository.findOne(id, {
      relations: ['author'],
    });
    if (postUpdate) {
      await this.postsSearchElasticService.updatePost(postUpdate);
      return postUpdate;
    }
    throw new PostNotFoundException(id);
  }
}
