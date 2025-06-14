import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

extendZodWithOpenApi(z);

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(100).openapi({
    description: 'Title of the post',
    example: 'Top 2025 Ai Trents',
  }),
  description: z.string().optional().openapi({
    description: 'Detailed description',
    example: 'km',
  }),
  date: z.coerce.date().openapi({
    description: 'Due date in ISO format',
    example: '2025-06-02T12:00:00Z',
  }),
});

export class CreatePostDto extends createZodDto(CreatePostSchema) {
  _id?: string;
  userId?: string | undefined;
  @ApiProperty({
    description: 'Title of the post',
    example: 'Top 2025 Ai Trents',
    minLength: 1,
    maxLength: 100,
  })
  title: string;

  @ApiProperty({
    description: 'Detailed description',
    example: 'Milk, Bread, Eggs',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Due date in ISO format',
    example: '2025-06-02T12:00:00Z',
    required: false,
    type: 'string',
    format: 'date-time',
  })
  date: Date;
}

export type CreatePostType = z.infer<typeof CreatePostSchema>;
