/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthRepository } from './repository/auth.repository';
import { RefreshTokenRepository } from './repository/refresh-token.schema';
import { ServiceResponse } from '../todos/todos.service';
import { LogInAuthDto } from './dto/login-auth.dto';
import { AuthHelper } from './helper/auth.helper';
import { Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly CACHE_KEYS = {
    USERS: 'users',
    USER: (id: string) => `user-${id}`,
  };
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly authRepository: AuthRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authHelper: AuthHelper,
  ) {}

  async signUp(createAuthDto: CreateAuthDto): Promise<ServiceResponse | any> {
    const { email, password } = createAuthDto;
    try {
      const emailInUse = await this.authRepository.findByEmail(email);
      if (emailInUse) {
        return {
          message: 'user already exists',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const hashedPassword = await this.authHelper.hashPassword(password);
      createAuthDto.password = hashedPassword;
      await this.authRepository.create(createAuthDto);

      return {
        message: 'user created successfully',
        data: createAuthDto,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async LogIn(
    createAuthDto: LogInAuthDto,
    res: Response,
  ): Promise<ServiceResponse | any> {
    const { email, password } = createAuthDto;
    try {
      const user = await this.authRepository.findByEmail(email);
      if (
        !user ||
        !(await this.authHelper.comparePassword(password, user.password))
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'wrong credentials',
        });
      }
      const token = await this.generateAndStoreToken(user._id.toString(), res);
      return res.status(HttpStatus.OK).json({
        message: 'user logged in successfully',
        data: {
          ...token,
          userId: user._id,
        },
      });
    } catch (error) {
      this.logger.error('Failed to login user', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to login user',
      });
    }
  }

  async findProfile(id: string) {
    try {
      const cachedUser = await this.cacheManager.get(this.CACHE_KEYS.USER(id));
      if (cachedUser) {
        return cachedUser;
      }

      const user = await this.authRepository.findById(id);
      if (!user) {
        return null;
      }

      const cleanUser = {
        _id: user._id,
        email: user.email,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isVerified: user.isVerified,
      };
      await this.cacheManager.set(this.CACHE_KEYS.USER(id), cleanUser, 6000000);
      return cleanUser;
    } catch (error) {
      this.logger.error(`Error finding profile for user ${id}:`, error);
      throw error;
    }
  }

  async refreshToken(
    refreshToken: string,
    res: Response,
  ): Promise<ServiceResponse | any> {
    try {
      console.log({ refreshToken });

      if (!refreshToken) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'No refresh token provided',
        });
      }
      const token = await this.refreshTokenRepository.findOne(refreshToken);

      if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'refresh token is invalid',
        });
      }
      const newGeneratedTokens = await this.generateAndStoreToken(
        token.userId.toString(),
        res,
      );
      if (!newGeneratedTokens) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Failed to generate new tokens',
        });
      }
      return res.status(HttpStatus.OK).json({
        message: 'Refresh token stored successfully',
        data: newGeneratedTokens,
      });
    } catch (error) {
      this.logger.error('Failed to login user', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to login user',
      });
    }
  }

  async generateAndStoreToken(userId: string, res: Response) {
    try {
      const token = this.authHelper.generateToken(userId);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      const userIdMongoose = this.refreshTokenRepository.setMongooseId(userId);
      await this.refreshTokenRepository.hardDeleteByUserId(userIdMongoose);
      await this.refreshTokenRepository.create({
        token: token.refreshToken,
        userId: userIdMongoose,
        expiryDate,
      });
      this.authHelper.attachTokenToResponse(res, token);
      return token;
    } catch (error) {
      this.logger.error('Failed to generate and store token', error);
      throw new InternalServerErrorException(
        'Failed to generate and store token',
      );
    }
  }
}
