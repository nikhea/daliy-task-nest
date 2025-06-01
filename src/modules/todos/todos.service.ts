/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoRepository } from './repository/todo.repository';
import { FindTodosQueryDto } from './dto/find-todos-query.dto';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const data = await this.todoRepository.create(createTodoDto);
      return {
        message: 'This action adds a new todos',
        data,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }

  async findAll(query: FindTodosQueryDto) {
    try {
      const data = await this.todoRepository.findAll();
      return {
        message: `This action returns all employees`,
        query,
        data,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.todoRepository.findById(id);

      if (!data) {
        return {
          message: `user not found`,
          data,
        };
      }

      return {
        message: `This action returns all employees`,
        data,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const existTodo = await this.todoRepository.findById(id);

      if (!existTodo) {
        return {
          message: `todo  not found`,
        };
      }
      const data = await this.todoRepository.update(id, updateTodoDto);
      return {
        message: `Todo updated successfully`,
        data,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }

  async setCompleted(id: string, isCompleted: boolean) {
    try {
      if (typeof isCompleted !== 'boolean') {
        return {
          message: 'Invalid input: isCompleted must be a boolean',
          statusCode: 400,
        };
      }

      const existTodo = await this.todoRepository.findById(id);

      if (!existTodo) {
        return {
          message: 'Todo not found',
          statusCode: 404,
        };
      }

      const data = await this.todoRepository.setCompleted(id, isCompleted);

      return {
        message: 'Todo updated successfully',
        data,
      };
    } catch (error) {
      return {
        message: 'Something went wrong',
        error: error,
      };
    }
  }

  async remove(id: string) {
    try {
      const existTodo = await this.todoRepository.findById(id);

      if (!existTodo) {
        return {
          message: `todo  not found`,
        };
      }
      const data = await this.todoRepository.delete(id);
      return {
        message: `This action removes a #${id} employee`,
        data,
      };
    } catch (error) {
      return {
        error,
      };
    }
  }
}
