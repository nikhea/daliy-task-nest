import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export const FindCommentsQuerySchema = z.object({
  postId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId')
    .openapi({
      description: 'ID of the post the comment belongs to',
      example: '60d21b4567d0d8992e610c84',
    }),
});

export class FindCommentsQueryDto {
  @ApiProperty({
    description: 'ID of the post the comment belongs to',
    example: '60d21b4567d0d8992e610c84',
  })
  @IsString()
  postId: string;
}

export type FindCommentsQueryType = z.infer<typeof FindCommentsQuerySchema>;
