import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { AuthRepository } from './repository/auth.repository';
import { RefreshTokenRepository } from './repository/refresh-token.schema';
import { AuthHelper } from './helper/auth.helper';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schema/refresh-token.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RefreshTokenRepository, AuthHelper],
  exports: [AuthRepository, AuthService],
})
export class AuthModule {}
