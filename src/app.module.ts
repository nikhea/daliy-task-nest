/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/require-await */

import { ExecutionContext, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './modules/todos/todos.module';
import { UsersModule } from './modules/users/users.module';
import envConfig from './config/env/env.config';
import { MongoDBConnectionModule } from './db/mongodb.db';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './common/constant/constant';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { ConfigService } from '@nestjs/config';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { VideoModule } from './modules/video/video.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            createKeyv(configService.get<string>('REDIS_URL_LOCAL')),
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
          ],
          ttl: 60000,
        };
      },
      inject: [ConfigService],
    }),
    // ThrottlerModule.forRootAsync({
    //   useFactory: (config: ConfigService) => ({
    // throttlers: [
    //   {
    //     name: 'short',
    //     limit: 3,
    //     ttl: seconds(4),
    //     blockDuration: seconds(2),
    //   },
    //   {
    //     name: 'medium',
    //     limit: 10,
    //     ttl: seconds(30),
    //     blockDuration: seconds(2),
    //   },
    //   {
    //     name: 'long',
    //     limit: 25,
    //     ttl: seconds(80),
    //     blockDuration: seconds(2),
    //   },
    // ],

    //     throttlers: [
    //       // Authentication & sensitive operations (login, password reset)
    //       {
    //         name: 'auth',
    //         limit: 5,
    //         ttl: seconds(60), // 5 attempts per minute
    //         blockDuration: seconds(60), // Block for 1 minute after limit
    //       },
    //       // Form submissions and mutations
    //       {
    //         name: 'short',
    //         limit: 20,
    //         ttl: seconds(60), // 20 requests per minute
    //         blockDuration: seconds(30),
    //       },
    //       // General API usage
    //       {
    //         name: 'medium',
    //         limit: 100,
    //         ttl: seconds(300), // 100 requests per 5 minutes (1.2k/hour)
    //         blockDuration: seconds(60),
    //       },
    //       // Heavy API consumers (authenticated users)
    //       {
    //         name: 'long',
    //         limit: 1000,
    //         ttl: seconds(3600), // 1000 requests per hour
    //         blockDuration: seconds(300), // 5 minute block
    //       },
    //       // Premium/enterprise tier
    //       {
    //         name: 'premium',
    //         limit: 5000,
    //         ttl: seconds(3600), // 5000 requests per hour
    //         blockDuration: seconds(60),
    //       },
    //       // Public endpoints (health checks, documentation)
    //       {
    //         name: 'public',
    //         limit: 10,
    //         ttl: seconds(60), // 10 requests per minute
    //         blockDuration: seconds(10),
    //       },
    //     ],
    //     errorMessage: 'Too many requests, please try again later.',
    //     storage: new ThrottlerStorageRedisService(
    //       config.get<string>('REDIS_URL_LOCAL'),
    //     ),
    //     getTracker: (req: Record<string, any>, context: ExecutionContext) => {
    //       const tenant = req.headers['x-tenant-ABC'] || req.ip;
    //       return tenant;
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL_LOCAL'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          attempts: 3,
        },
      }),
      inject: [ConfigService],
    }),

    MulterModule.register(multerOptions),
    MongoDBConnectionModule,
    AuthModule,
    UsersModule,
    TodosModule,
    VideoModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
