import { HttpStatus, Injectable, Inject, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly CACHE_KEYS = {
    USERS: 'users',
    USER: (id: string) => `user-${id}`,
  };

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const cachedUser = await this.cacheManager.get(this.CACHE_KEYS.USER(id));

    if (cachedUser) {
      return {
        message: 'Todo retrieved from cache',
        data: { cachedUser },
        statusCode: HttpStatus.OK,
      };
    }

    const data = {
      _id: id,
      email: 'imonikheaugbodaga@gmail.com',
      username: 'fortune',
    };

    await this.cacheManager.set(this.CACHE_KEYS.USER(id), data, 300 * 1000);

    return {
      message: 'Todo retrieved successfully',
      data,
      statusCode: HttpStatus.OK,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
