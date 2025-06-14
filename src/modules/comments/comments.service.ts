/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  IPostService,
  IPostServiceToken,
} from '../../contracts/posts/post.interface';
import { ICommentsService } from '../../contracts/comments/comments.interface';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AlsService } from '../als/als.service';
import { CommentRepository } from './repository/comments.repository';
import { ServiceResponse } from '../todos/todos.service';
// import { FindCommentsQueryDto } from './dto/get-comment.dto';

@Injectable()
export class CommentsService implements ICommentsService {
  private readonly logger = new Logger(CommentsService.name);
  private readonly CACHE_KEYS = {
    COMMENTS: 'comments',
    COMMENT: (id: string) => `comment-${id}`,
  };

  constructor(
    @Inject(IPostServiceToken)
    private readonly postService: IPostService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly commentsRepository: CommentRepository,
    private readonly contextService: AlsService,
  ) {}

  async clearCommentsCache(): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.COMMENTS);
      this.logger.log('cache cleared');
    } catch (error) {
      this.logger.error('Failed to clear cache', error);
    }
  }

  async clearCommentCache(id: string): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.COMMENT(id));
      this.logger.log(` cache cleared for id: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to clear cache for id: ${id}`, error);
    }
  }

  async create(
    createCommentDto: CreateCommentDto,
  ): Promise<ServiceResponse | any> {
    const user = this.contextService.getUser();
    try {
      if (!user) {
        this.logger.warn('No user found in context');
        return {
          message: 'User not authenticated',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
      const Post = await this.postService.getPostById(createCommentDto.postId);
      if (!Post.data) {
        return {
          message: `${Post.message} with ${createCommentDto.postId} id`,
          statusCode: Post.statusCode,
        };
      }
      if (user._id === Post.data.userId?.toString()) {
        return {
          message: 'User can not comment on own post',
          statusCode: Post.statusCode,
        };
      }
      createCommentDto.userId = user._id;
      const data = await this.commentsRepository.create(createCommentDto);
      await this.clearCommentsCache();
      return {
        message: 'comment created successfully',
        data: data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        message: 'Failed to create comment',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(postId: string): Promise<ServiceResponse | any> {
    try {
      const cacheComments = await this.cacheManager.get(
        this.CACHE_KEYS.COMMENT(postId),
      );

      if (cacheComments) {
        return {
          statusCode: HttpStatus.OK,
          message: 'comments retrieved successfully',
          data: cacheComments,
        };
      }

      const Post = await this.postService.getPostById(postId);

      if (!Post.data) {
        return {
          message: `${Post.message} with ${postId} id`,
          statusCode: Post.statusCode,
        };
      }

      const data = await this.commentsRepository.findAllByPostId(postId);
      await this.cacheManager.set(this.CACHE_KEYS.COMMENT(postId), data);
      return {
        statusCode: HttpStatus.OK,
        message: 'comments retrieved successfully',
        data,
      };
    } catch (error) {
      return {
        message: 'Failed to retrieved comment',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: string): Promise<ServiceResponse | any> {
    try {
      const cachedComment = await this.cacheManager.get(
        this.CACHE_KEYS.COMMENT(id),
      );
      if (cachedComment) {
        return {
          message: 'comment retrieved from cache',
          data: cachedComment,
          statusCode: HttpStatus.OK,
        };
      }
      const data = await this.commentsRepository.findById(id);
      if (!data) {
        return {
          message: 'Comment not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      await this.cacheManager.set(this.CACHE_KEYS.COMMENT(id), data);
      return {
        message: 'Comment retrieved successfully',
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch Post',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} comment`;
  // }

  async getPostComments(postId: string) {
    await this.postService.getPostById(postId);
  }
}
