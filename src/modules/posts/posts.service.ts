/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AlsService } from '../als/als.service';
import { PostRepository } from './repository/posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { ServiceResponse } from '../todos/todos.service';
import { IPostService } from '../../contracts/posts/post.interface';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService implements IPostService {
  private readonly logger = new Logger(PostsService.name);
  private readonly CACHE_KEYS = {
    POSTS: 'posts',
    POST: (id: string) => `post-${id}`,
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly postRepository: PostRepository,
    private readonly contextService: AlsService,
  ) {}

  async clearPostsCache(): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.POSTS);
      this.logger.log('Posts cache cleared');
    } catch (error) {
      this.logger.error('Failed to clear Posts cache', error);
    }
  }

  async clearPostCache(id: string): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.POST(id));
      this.logger.log(`Post cache cleared for id: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to clear Post cache for id: ${id}`, error);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<ServiceResponse | any> {
    const user = this.contextService.getUser();

    try {
      if (!user) {
        this.logger.warn('No user found in context');
        return {
          message: 'User not authenticated',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
      createPostDto.userId = user._id;
      const data = await this.postRepository.create(createPostDto);
      await this.clearPostsCache();
      return {
        message: 'Posts created successfully',
        data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('Failed to create post', error);
      return {
        message: 'Failed to create post',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(): Promise<ServiceResponse | any> {
    const user = this.contextService.getUser();

    try {
      if (!user) {
        return {
          message: 'User not authenticated',
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
      const cachePosts = await this.cacheManager.get(this.CACHE_KEYS.POSTS);

      if (cachePosts) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Posts retrieved from cache',
          data: cachePosts,
        };
      }

      const data = await this.postRepository.findAll({
        userId: user._id,
      });
      await this.cacheManager.set(this.CACHE_KEYS.POSTS, data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Posts retrieved successfully',
        data,
      };
    } catch (error) {
      return {
        message: 'Failed to fetch Posts',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: string): Promise<ServiceResponse | any> {
    try {
      const cachedPost = await this.cacheManager.get(this.CACHE_KEYS.POST(id));
      if (cachedPost) {
        return {
          message: 'Post retrieved from cache',
          data: { cachedPost },
          statusCode: HttpStatus.OK,
        };
      }

      const data = await this.postRepository.findById(id);

      if (!data) {
        return {
          message: 'Post not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      await this.cacheManager.set(this.CACHE_KEYS.POST(id), data);

      return {
        message: 'Post retrieved successfully',
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

  async remove(id: string): Promise<ServiceResponse | any> {
    try {
      const existingPost = await this.postRepository.findById(id);
      if (!existingPost) {
        return {
          message: 'Post not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      await this.postRepository.delete(id);
      await this.cacheManager.del(this.CACHE_KEYS.POST(id));
      await this.clearPostsCache();

      return {
        message: 'Post deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Failed to delete Post',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getPostById(id: string): Promise<ServiceResponse | any> {
    try {
      // const cachedPost = await this.cacheManager.get(this.CACHE_KEYS.POST(id));
      // if (cachedPost) {
      //   return {
      //     message: 'Post retrieved from cache',
      //     data: { cachedPost },
      //     statusCode: HttpStatus.OK,
      //   };
      // }
      console.log({ id });

      const data = await this.postRepository.findById(id);

      if (!data) {
        return {
          message: 'Post not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      // await this.cacheManager.set(this.CACHE_KEYS.POST(id), data);

      return {
        message: 'Post retrieved successfully',
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
}
