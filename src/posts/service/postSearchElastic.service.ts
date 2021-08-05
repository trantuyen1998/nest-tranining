import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from '../post.entity';
@Injectable()
export default class PostSearchElasticService {
  index = 'post';
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticSearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        paragraphs: post.paragraphs,
        authorId: post.author.id,
      },
    });
  }

  async searchPost(text: string) {
    const { body } = await this.elasticSearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          /**
           * Search more condition
           */
          multi_match: {
            query: text,
            fields: ['title', 'paragraphs'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async removePost(postId: number) {
    this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async updatePost(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      paragraphs: post.paragraphs,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result}  ctx._source.${key} = '${value}'`;
    }, '');

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }
}
