import { Module } from '@nestjs/common';
import { TodosModule } from './modules/todos/todos.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [TodosModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
