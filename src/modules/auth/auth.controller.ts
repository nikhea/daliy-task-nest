import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LogInAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { RefreshTokenAuthDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Post('logIn')
  logIn(@Body() loginAuthDto: LogInAuthDto, @Res() res: Response) {
    return this.authService.LogIn(loginAuthDto, res);
  }

  @Post('refresh')
  refreshToken(
    @Body() refreshTokenAuthDto: RefreshTokenAuthDto,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(refreshTokenAuthDto, res);
  }
}
