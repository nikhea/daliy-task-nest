import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoRepository } from './repository/todo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './shcema/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService, TodoRepository],
  exports: [TodoRepository],
})
export class TodosModule {}
