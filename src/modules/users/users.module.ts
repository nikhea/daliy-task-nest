import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
