import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Match } from './match.decorator';

extendZodWithOpenApi(z);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const CreateUserSchema = z
  .object({
    email: z.string().email().openapi({
      description: 'user email address',
      example: 'doe@gmail.com',
    }),
    name: z.string().min(2).max(100).openapi({
      description: 'name of the user',
      example: 'mike doe',
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
    confirmPassword: z
      .string()
      .min(6)
      .regex(passwordRegex, {
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      })
      .openapi({
        description: 'repeat password for confirmation',
        example: 'My$ecurePwd1',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export class CreateAuthDto extends createZodDto(CreateUserSchema) {
  @ApiProperty({
    description: 'name of the user',
    example: 'mike doe',
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

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
  @ApiProperty({
    description: 'repeat password for confirmation',
    example: 'My$ecurePwd1',
    required: true,
  })
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty()
  @MinLength(6)
  @Match('password', { message: 'Passwordcdsds do not match' })
  confirmPassword: string;
}

export type CreateUserType = z.infer<typeof CreateUserSchema>;
