import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

extendZodWithOpenApi(z);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const ResetPasswordSchema = z.object({
  token: z.string().openapi({
    description: 'email reset token',
    example: 'HFQr8SMdYf3jvaqk73ZhkIhbQdblxPvbMBV3Wgt1TqEgAPt_UsgrR92SgNDv2Qp_',
  }),
  newPassword: z
    .string()
    .min(6)
    .regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    })
    .openapi({
      description: 'password of the user',
      example: 'My$ecurePwd1',
    }),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
  @ApiProperty({
    description: 'email reset token',
    example: 'HFQr8SMdYf3jvaqk73ZhkIhbQdblxPvbMBV3Wgt1TqEgAPt_UsgrR92SgNDv2Qp_',
    required: true,
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'My$ecurePwd1',
    required: true,
  })
  @Matches(passwordRegex, {
    message:
      'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
  })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
