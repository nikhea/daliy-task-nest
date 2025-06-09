/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../decorator/user.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TUser } from '../interface/user.interface';
import { AuthService } from '../../modules/auth/auth.service';
import { AlsService } from '../../modules/als/als.service';

@Injectable()
export class AuthAndVerificationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly contextService: AlsService,
  ) {}

  private extractTokenFromRequest(request: Request): string {
    let token: string | null = null;
    const authHeader = request.headers['authorization'] as string;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = request.cookies?.['access_token'];
    }

    if (!token) {
      throw new UnauthorizedException(
        'No authentication token found in Authorization header or cookies',
      );
    }
    return token;
  }

  private async getUser(id: string): Promise<TUser> {
    const userResponse = await this.authService.findProfile(id);
    if (!userResponse) {
      throw new UnauthorizedException('User not found. Please login again.');
    }
    return userResponse as TUser;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const token = this.extractTokenFromRequest(request);

      const decoded: any = this.jwtService.verify(token);

      if (!decoded || !decoded.userId) {
        throw new UnauthorizedException('Invalid token. Please login again.');
      }

      const user = await this.getUser(decoded.userId);

      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account.',
        );
      }

      this.contextService.setContext({ user });

      // const contextUser = this.contextService.getUser();
      // console.log('User from context after setting:', contextUser);
      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // console.error('Auth error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
