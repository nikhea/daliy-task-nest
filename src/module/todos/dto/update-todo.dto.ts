/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { CreateTodoSchema } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';

extendZodWithOpenApi(z);

export const UpdateTodoSchema = CreateTodoSchema.partial();

export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) {
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

export type UpdateTodoType = z.infer<typeof UpdateTodoSchema>;
