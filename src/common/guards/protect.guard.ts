/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthenticatedRequest } from '../decorator/user.decorator';

@Injectable()
export class AuthAndVerificationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    let token: string | null = null;
    const authHeader = request.headers['authorization'] as string;

    console.log({
      cookies: request.cookies,
    });

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = request.cookies?.['access_token'];
      // request.cookies?.['token'] ||
      // request.cookies?.['auth_token'] ||
      // request.cookies?.['jwt'];
    }

    if (!token) {
      throw new UnauthorizedException(
        'No authentication token found in Authorization header or cookies',
      );
    }

    try {
      // Step 2: Verify token and get user
      // TODO: Replace with actual JWT verification
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // const user = await this.userService.findById(decoded.sub);

      const user = {
        _id: 1,
        email: 'imonikheaugbodaga@gmail.com',
        firstname: 'imonikhea',
        lastname: 'ugbodaga',
        isVerified: true,
      };

      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account.',
        );
      }

      request.user = { ...user, token };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Auth error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
