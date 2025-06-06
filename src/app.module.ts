/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            createKeyv('redis://localhost:6379'),
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
          ],
          ttl: 60000,
        };
      },
    }),
    MulterModule.register(multerOptions),
    MongoDBConnectionModule,
    TodosModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// CacheModule.register({
//   isGlobal: true,
//   ttl: 60 * 1000,
//   store: () => {
//     const redis = new KeyvRedis('redis://localhost:6379');
//     return new Keyv({ store: redis });
//   },
// }),
