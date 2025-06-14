import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

extendZodWithOpenApi(z);

export const CommentZodSchema = z.object({
  content: z.string().min(1).openapi({
    description: 'Text content of the comment',
    example: 'This is a great post!',
  }),
  authorId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId')
    .openapi({
      description: 'User ID of the comment author',
      example: '60d21b4667d0d8992e610c85',
    }),
  postId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId')
    .openapi({
      description: 'ID of the post the comment belongs to',
      example: '60d21b4567d0d8992e610c84',
    }),
  // parentId: z
  //   .string()
  //   .regex(/^[a-f\d]{24}$/i)
  //   .optional()
  //   .nullable()
  //   .openapi({
  //     description: 'Optional ID of the parent comment (for nested comments)',
  //     example: '60d21b4767d0d8992e610c86',
  //   }),
});

export class CreateCommentDto extends createZodDto(CommentZodSchema) {
  _id?: string;
  userId?: string | undefined;
  @ApiProperty({
    description: 'Text content of the comment',
    example: 'This is a great post!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'User ID of the comment author',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  authorId: string;

  @ApiProperty({
    description: 'ID of the post the comment belongs to',
    example: '60d21b4567d0d8992e610c84',
  })
  @IsString()
  postId: string;

  // @ApiProperty({
  //   description: 'Optional ID of the parent comment (for nested structure)',
  //   example: '60d21b4767d0d8992e610c86',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // parentId?: string;
}

export type CommentZodType = z.infer<typeof CommentZodSchema>;
