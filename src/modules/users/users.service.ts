/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  // HttpStatus,
  Injectable,
  Inject,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthRepository } from '../auth/repository/auth.repository';
import { Response } from 'express';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly CACHE_KEYS = {
    USERS: 'users',
    USER: (id: string) => `user-${id}`,
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authRepository: AuthRepository,
  ) {}

  async findProfile(id: string) {
    try {
      const cachedUser = await this.cacheManager.get(this.CACHE_KEYS.USER(id));
      if (cachedUser) {
        return {
          message: 'User found successfully',
          data: cachedUser,
          statusCode: HttpStatus.OK,
        };
      }
      const user = await this.authRepository.findById(id);
      if (!user) {
        this.logger.warn(`User not found: ${id}`);
        return {
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
      await this.cacheManager.set(this.CACHE_KEYS.USER(id), user);
      this.logger.log(`User cached successfully: ${id}`);
      return user;
    } catch (error) {
      return {
        message: `Error finding profile for user ${id}:`,
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
