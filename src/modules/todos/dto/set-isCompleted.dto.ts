/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
export interface SetTodocompleted {
  isCompleted: boolean;
}

export class SetTodocompletedDto {
  @ApiProperty({
    description: 'Mark todo as completed or not',
    example: true,
    required: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    throw new BadRequestException('isCompleted must be a boolean');
  })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}

// export const SetTodocompletedSchema = z.object({
//   isCompleted: z.coerce.boolean(),
// });

// export class SetTodocompletedDto {
//   @ApiProperty({
//     description: 'Page number for pagination',
//     required: true,
//   })
//   @IsBoolean()
//   @IsNotEmpty()

//   isCompleted: boolean;
// }

// export type SetTodocompletedType = z.infer<typeof SetTodocompletedSchema>;
