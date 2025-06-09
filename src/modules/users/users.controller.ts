import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthAndVerificationGuard } from '../../common/guards/auth-verification.guard';
import { AuthenticatedRequest } from '../../common/decorator/user.decorator';

@UseGuards(AuthAndVerificationGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  findOne(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return {
      user,
    };
  }
}
// @SkipThrottle({ short: true, medium: true, long: true })
