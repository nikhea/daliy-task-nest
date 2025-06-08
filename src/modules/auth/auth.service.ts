/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthRepository } from './repository/auth.repository';
import { ServiceResponse } from '../todos/todos.service';
import { LogInAuthDto } from './dto/login-auth.dto';
import { AuthHelper } from './helper/auth.helper';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly authRepository: AuthRepository,
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

      const token = this.authHelper.generateToken(user._id.toString());
      const options = this.authHelper.getCokkiesOptions('access_token');

      res.cookie(options.name, token.accessToken, options.settings);

      return res.status(HttpStatus.OK).json({
        message: 'user logged in successfully',
        data: token,
      });
    } catch (error) {
      this.logger.error('Failed to login user', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to login user',
      });
    }
  }
}
