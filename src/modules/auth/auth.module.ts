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
import { ResetToken, ResetTokenSchema } from './schema/reset-token.shcema';
import { ResetTokenRepository } from './repository/reset-token.schema';
import { MailModule } from '../mail/mail.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    RefreshTokenRepository,
    ResetTokenRepository,
    AuthHelper,
  ],
  exports: [AuthRepository, AuthService],
})
export class AuthModule {}
