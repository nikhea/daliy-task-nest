import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

extendZodWithOpenApi(z);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ChangePasswordSchema = z
  .object({
    oldPassword: z
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
    newPassword: z
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
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'Passwords can not be the same value',
  });

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {
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
  oldPassword: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'My$ecurePwd1!',
    required: true,
  })
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export type ChangePasswordDtoType = z.infer<typeof ChangePasswordSchema>;
