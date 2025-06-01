// src/module/todos/dto/find-todos-query.dto.ts
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const FindTodosQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['pending', 'completed', 'all']).default('all'),
  sortBy: z.enum(['title', 'dueDate', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  dueBefore: z.coerce.date().optional(),
  dueAfter: z.coerce.date().optional(),
});

export class FindTodosQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term to filter todos by title or description',
    example: 'groceries',
    required: false,
  })
  search?: string;

  @ApiProperty({
    description: 'Filter by todo status',
    enum: ['pending', 'completed', 'all'],
    example: 'all',
    default: 'all',
    required: false,
  })
  status?: 'pending' | 'completed' | 'all' = 'all';

  @ApiProperty({
    description: 'Field to sort by',
    enum: ['title', 'dueDate', 'createdAt'],
    example: 'createdAt',
    default: 'createdAt',
    required: false,
  })
  sortBy?: 'title' | 'dueDate' | 'createdAt' = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
    required: false,
  })
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: 'Filter todos due before this date',
    example: '2025-06-10T00:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  dueBefore?: Date;

  @ApiProperty({
    description: 'Filter todos due after this date',
    example: '2025-06-01T00:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  dueAfter?: Date;
}

export type FindTodosQueryType = z.infer<typeof FindTodosQuerySchema>;
