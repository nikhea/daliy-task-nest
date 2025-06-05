import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './modules/todos/todos.module';
import { UsersModule } from './modules/users/users.module';
import envConfig from './config/env/env.config';
import { MongoDBConnectionModule } from './db/mongodb.db';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from './common/constant/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
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
