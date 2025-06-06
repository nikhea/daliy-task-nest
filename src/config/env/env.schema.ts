import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).default('4000'),
  MONGO_URI: z.string().url(),
  API_VERSION: z.string(),
  ALLOWED_ORIGINS: z.string().optional(),
  NODE_ENV: z.string().default('development'),
  REDIS_URL_LOCAL: z.string().url(),
  REDIS_URL: z.string().url(),
  // RABBITMQ_URI: z.string().url(),
  // JWT_SECRET: z.string().min(10),
});

export type EnvVars = z.infer<typeof envSchema>;
