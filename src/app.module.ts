import { Module } from '@nestjs/common';
import { TodosModule } from './module/todos/todos.module';
import { UsersModule } from './module/users/users.module';
@Module({
  imports: [TodosModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
