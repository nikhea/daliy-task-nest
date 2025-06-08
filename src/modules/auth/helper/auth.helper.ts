import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthHelper {
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

  generateToken(userId: string): { accessToken: string } {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    return {
      accessToken,
    };
  }
  getCokkiesOptions(name: string) {
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
}
