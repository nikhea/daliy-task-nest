import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

export const UploadFileSchema = z.object({
  description: z.string().optional().openapi({
    description: 'Detailed description',
    example: 'Milk, Bread, Eggs',
  }),
});

export class FileUploadDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files?: any[];

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  file?: any;

  @ApiProperty({
    description: 'Detailed description',
    example: 'Milk, Bread, Eggs',
    required: false,
  })
  @IsOptional()
  description?: string;
}

// export class UploadDto {
//   @ApiProperty({
//     description: 'Detailed description',
//     example: 'Milk, Bread, Eggs',
//     required: false,
//   })
//   @IsOptional()
//   @IsOptional()
//   description?: string;
// }

export type UploadFileType = z.infer<typeof UploadFileSchema>;
