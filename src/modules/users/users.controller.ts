import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthAndVerificationGuard } from '../../common/guards/auth-verification.guard';
import { SkipThrottle } from '@nestjs/throttler';

@UseGuards(AuthAndVerificationGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipThrottle({ short: true, medium: true, long: true })
  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findProfile(id);
  }
}
