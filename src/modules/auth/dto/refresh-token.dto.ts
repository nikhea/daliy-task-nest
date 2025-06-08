import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

extendZodWithOpenApi(z);

export const RefreshTokenAuthSchema = z.object({
  token: z.string().openapi({
    description: 'refresh token',
    example: 'bbf66a42-1b48-48d0-a634-b5a881375239',
  }),
});

export class RefreshTokenAuthDto extends createZodDto(RefreshTokenAuthSchema) {
  @ApiProperty({
    description: 'user email address',
    example: 'bbf66a42-1b48-48d0-a634-b5a881375239',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export type RefreshTokenAuthType = z.infer<typeof RefreshTokenAuthSchema>;
