import { envSchema, EnvVars } from './env.schema';

export default (): EnvVars => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }

  return {
    PORT: parsed.data.PORT,
    MONGO_URI: parsed.data.MONGO_URI,
    JWT_SECRET: parsed.data.JWT_SECRET,
    API_VERSION: parsed.data.API_VERSION,
    ALLOWED_ORIGINS: parsed.data.ALLOWED_ORIGINS,
    NODE_ENV: parsed.data.NODE_ENV,
    REDIS_URL_LOCAL: parsed.data.REDIS_URL_LOCAL,
    REDIS_URL: parsed.data.REDIS_URL,
    // RABBITMQ_URI: parsed.data.RABBITMQ_URI,
  };
};
