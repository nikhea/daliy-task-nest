import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

extendZodWithOpenApi(z);

export const ForgotPasswordSchema = z.object({
  email: z.string().email().openapi({
    description: 'user email address',
    example: 'imonikhea@gmail.com',
  }),
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {
  @ApiProperty({
    description: 'user email address',
    example: 'imonikhea@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
