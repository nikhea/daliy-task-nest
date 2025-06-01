/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

extendZodWithOpenApi(z);

export const CreateTodoSchema = z.object({
  title: z.string().min(1).max(100).openapi({
    description: 'Title of the todo item',
    example: 'Buy groceries',
  }),
  description: z.string().optional().openapi({
    description: 'Detailed description',
    example: 'Milk, Bread, Eggs',
  }),
  dueDate: z.coerce.date().optional().openapi({
    description: 'Due date in ISO format',
    example: '2025-06-02T12:00:00Z',
  }),
});

export class CreateTodoDto extends createZodDto(CreateTodoSchema) {
  @ApiProperty({
    description: 'Title of the todo item',
    example: 'Buy groceries',
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
  dueDate?: Date;
}

export class Cat {
  @ApiProperty()
  data: CreateTodoDto;
}
export type CreateTodoType = z.infer<typeof CreateTodoSchema>;
