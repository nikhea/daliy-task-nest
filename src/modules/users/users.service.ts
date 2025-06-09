import {
  // HttpStatus,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import { AuthRepository } from '../auth/repository/auth.repository';
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
    // private readonly authRepository: AuthRepository,
  ) {}

  // async findProfile(id: string) {
  //   try {
  //     const cachedUser = await this.cacheManager.get(this.CACHE_KEYS.USER(id));
  //     if (cachedUser) {
  //       this.logger.log(`User found in cache: ${id}`);
  //       return {
  //         message: 'User found successfully',
  //         data: cachedUser,
  //         statusCode: HttpStatus.OK,
  //       };
  //     }
  //     const user = await this.authRepository.findById(id);
  //     if (!user) {
  //       this.logger.warn(`User not found: ${id}`);
  //       return {
  //         message: 'User not found',
  //         statusCode: HttpStatus.NOT_FOUND,
  //       };
  //     }
  //     await this.cacheManager.set(this.CACHE_KEYS.USER(id), user);
  //     this.logger.log(`User cached successfully: ${id}`);
  //     return user;
  //     // return {
  //     //   message: 'User found successfully',
  //     //   data: user,
  //     //   statusCode: HttpStatus.OK,
  //     // };
  //   } catch (error) {
  //     this.logger.error(`Error finding profile for user ${id}:`, error);
  //     return {
  //       message: 'Failed to delete todo',
  //       error,
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //     };
  //   }
  // }
}
