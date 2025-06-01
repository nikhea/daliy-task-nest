import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).default('4000'),
  MONGO_URI: z.string().url(),
  // JWT_SECRET: z.string().min(10),
  API_VERSION: z.string(),
  ALLOWED_ORIGINS: z.string().optional(),
  NODE_ENV: z.string().default('development'),
  // RABBITMQ_URI: z.string().url(),
});

export type EnvVars = z.infer<typeof envSchema>;
