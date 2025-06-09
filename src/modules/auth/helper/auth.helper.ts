import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  constructor(private jwtService: JwtService) {}
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const comparePassword = await bcrypt.compare(password, userPassword);
    return comparePassword;
  }

  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    return {
      accessToken,
      refreshToken,
    };
  }
  generateResetToken(): string {
    const resetToken = nanoid(64);
    return resetToken;
  }
  getCookieSettings(name: string) {
    return {
      name,
      settings: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 1 * 60 * 1000,
      },
    };
  }
  attachTokenToResponse(
    res: Response,
    tokenPair: { accessToken: string; refreshToken: string },
  ) {
    const cookieOptions = this.getCookieSettings('access_token');
    res.cookie(
      cookieOptions.name,
      tokenPair.accessToken,
      cookieOptions.settings,
    );
  }

  generateExpiryDate(dateLength: number): Date {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + dateLength);
    return expiryDate;
  }
}
