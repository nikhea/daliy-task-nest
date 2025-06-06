import {
  Controller,
  Get,
  Param,
  Res,
  // UseGuards,
  // Delete,
  // Post,
  // UseInterceptors,
  // Body,
  // Patch,
} from '@nestjs/common';
import { Response } from 'express'; // This is the key import!
import { UsersService } from './users.service';
import { SkipThrottle } from '@nestjs/throttler';

// import { ApiBearerAuth } from '@nestjs/swagger';
// import { AuthAndVerificationGuard } from 'src/common/guards/protect.guard';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { TAuthUser } from 'src/common/decorator/user.decorator';

// @UseGuards(AuthAndVerificationGuard)
// @ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @SkipThrottle({ short: true, medium: true, long: true })
  @Get(':id')
  findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const token = '1234';

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 60 * 1000,
    });

    return this.usersService.findOne(id);

    // return {
    //   access_token: token,

    // return this.usersService.findOne(+id);
    // };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
