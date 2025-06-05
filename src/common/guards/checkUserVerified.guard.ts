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
export class AuthVerificationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const { user } = request;

    try {
      if (!user) {
        throw new UnauthorizedException('user not found');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account.',
        );
      }

      console.log(request.user);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
