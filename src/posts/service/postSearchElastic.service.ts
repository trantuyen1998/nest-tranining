import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  PostSearchBody,
  PostSearchResult,
  PostCountResult,
} from '../interface/postSearchBody.interface';
import Post from '../post.entity';
@Injectable()
export default class PostSearchElasticService {
  index = 'posts';
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

  /**
   *
   * @param text
   * @param offset
   * @param limit
   * @returns
   * Elasticsearch return List post with pagination
   */
  async searchPost(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }
    const { body } = await this.elasticSearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'paragraphs'],
              },
            },
            filter: {
              range: {
                id: {
                  gt: startId,
                },
              },
            },
          },
        },
        sort: {
          id: {
            order: 'asc',
          },
        },
      },
    });
    const count = body.hits.total.valueOf;
    const hits = body.hits.hits;
    const results = hits.map((item) => item._source);
    return {
      results,
      count: startId ? separateCount : count,
    };
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

  /**
   *
   * @param query
   * @param fields
   * @returns
   * Count for keyset pagination
   */
  async count(query: string, fields: string[]) {
    const { body } = await this.elasticSearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields,
          },
        },
      },
    });
    return body.count;
  }
}
