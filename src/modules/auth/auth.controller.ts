/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LogInAuthDto } from './dto/login-auth.dto';
import { Response, Request } from 'express';
import { RefreshTokenAuthDto } from './dto/refresh-token.dto';
import { AuthenticatedRequest } from '../../common/decorator/user.decorator';
import { AuthAndVerificationGuard } from '../../common/guards/auth-verification.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
    @Req() req: Request,
  ) {
    const refreshToken =
      refreshTokenAuthDto.token || req.cookies['refresh_token'];

    return this.authService.refreshToken(refreshToken, res);
  }

  @ApiBearerAuth()
  @UseGuards(AuthAndVerificationGuard)
  @Get('current-user')
  findOne(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return {
      user,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthAndVerificationGuard)
  @Put('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.changePassword(changePasswordDto, res);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto, res);
  }

  @Put('rest-password')
  resetPassword(
    @Body() forgotPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    return this.authService.resetPassword(forgotPasswordDto, res);
  }
}
