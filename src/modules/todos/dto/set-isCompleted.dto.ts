/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { CreateTodoSchema } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';

extendZodWithOpenApi(z);

export const SetTodoSchema = CreateTodoSchema.partial();

export class SetTodoDto extends createZodDto(SetTodoSchema) {
  @ApiProperty({
    example: true,
  })
  isCompleted: boolean;
}

export type SetTodoType = z.infer<typeof SetTodoSchema>;
