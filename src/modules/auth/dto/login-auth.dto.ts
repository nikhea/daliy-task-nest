import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

extendZodWithOpenApi(z);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const LogInUserSchema = z.object({
  email: z.string().email().openapi({
    description: 'user email address',
    example: 'doe@gmail.com',
  }),
  password: z
    .string()
    .min(6)
    .regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    })
    .openapi({
      description: 'password of the user',
      example: 'My$ecurePwd1',
    }),
});

export class LogInAuthDto extends createZodDto(LogInUserSchema) {
  @ApiProperty({
    description: 'user email address',
    example: 'doe@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'password of the user',
    example: 'My$ecurePwd1',
    required: true,
  })
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export type LogInUserType = z.infer<typeof LogInUserSchema>;
