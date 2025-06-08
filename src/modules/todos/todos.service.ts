/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoRepository } from './repository/todo.repository';
import { FindTodosQueryDto } from './dto/find-todos-query.dto';
import { TAuthUser } from 'src/common/decorator/user.decorator';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

export interface ServiceResponse<T = any> {
  message: string;
  data?: T;
  statusCode?: number;
  error?: any;
}

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  private readonly CACHE_KEYS = {
    TODOS: 'todos',
    TODO: (id: string) => `todo-${id}`,
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly todoRepository: TodoRepository,
  ) {}

  async clearTodosCache(): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.TODOS);
      this.logger.log('Todos cache cleared');
    } catch (error) {
      this.logger.error('Failed to clear todos cache', error);
    }
  }

  async clearTodoCache(id: string): Promise<void> {
    try {
      await this.cacheManager.del(this.CACHE_KEYS.TODO(id));
      this.logger.log(`Todo cache cleared for id: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to clear todo cache for id: ${id}`, error);
    }
  }
  /**
   * Creates a new todo item.
   * @param createTodoDto - The data for the new todo item.
   * @returns A service response containing the created todo item or an error message.
   */
  async create(createTodoDto: CreateTodoDto): Promise<ServiceResponse | any> {
    try {
      const data = await this.todoRepository.create(createTodoDto);
      await this.clearTodosCache();
      return {
        message: 'Todo created successfully',
        data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('Failed to create todo', error);
      return {
        message: 'Failed to create todo',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findAll(
    query: FindTodosQueryDto,
    user: TAuthUser | any,
  ): Promise<ServiceResponse | any> {
    try {
      this.logger.log(`Fetching todos for user: ${user}`);
      const cacheTodos = await this.cacheManager.get(this.CACHE_KEYS.TODOS);

      if (cacheTodos) {
        this.logger.log('Returning todos from cache');
        return {
          message: 'Todos retrieved from cache',
          data: { cacheTodos },
          statusCode: HttpStatus.OK,
        };
      }

      const data = await this.todoRepository.findAll();
      await this.cacheManager.set(this.CACHE_KEYS.TODOS, data);

      this.logger.log(
        `Retrieved ${Array.isArray(data) ? data.length : 0} todos from database`,
      );

      return {
        message: 'Todos retrieved successfully',
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Failed to fetch todos', error);
      return {
        message: 'Failed to fetch todos',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(id: string): Promise<ServiceResponse | any> {
    try {
      this.logger.log(`Fetching todo with id: ${id}`);

      const cachedTodo = await this.cacheManager.get(this.CACHE_KEYS.TODO(id));
      if (cachedTodo) {
        this.logger.log(`Returning todo ${id} from cache`);
        return {
          message: 'Todo retrieved from cache',
          data: { cachedTodo },
          statusCode: HttpStatus.OK,
        };
      }

      const data = await this.todoRepository.findById(id);

      if (!data) {
        this.logger.warn(`Todo with id ${id} not found`);
        return {
          message: 'Todo not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      await this.cacheManager.set(this.CACHE_KEYS.TODO(id), data);

      return {
        message: 'Todo retrieved successfully',
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch todo with id: ${id}`, error);
      return {
        message: 'Failed to fetch todo',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<ServiceResponse | any> {
    try {
      this.logger.log(`Updating todo with id: ${id}`);

      const existingTodo = await this.todoRepository.findById(id);

      if (!existingTodo) {
        this.logger.warn(`Todo with id ${id} not found for update`);
        return {
          message: 'Todo not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      const data = await this.todoRepository.update(id, updateTodoDto);

      // Update cache with new data
      await this.cacheManager.set(this.CACHE_KEYS.TODO(id), data);
      // Invalidate todos list cache
      await this.clearTodosCache();

      return {
        message: 'Todo updated successfully',
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Failed to update todo with id: ${id}`, error);
      return {
        message: 'Failed to update todo',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async setCompleted(
    id: string,
    isCompleted: boolean,
  ): Promise<ServiceResponse | any> {
    try {
      this.logger.log(
        `Setting completion status for todo ${id} to ${isCompleted}`,
      );

      if (typeof isCompleted !== 'boolean') {
        return {
          message: 'Invalid input: isCompleted must be a boolean',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      const existingTodo = await this.todoRepository.findById(id);

      if (!existingTodo) {
        this.logger.warn(`Todo with id ${id} not found for completion update`);
        return {
          message: 'Todo not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      const data = await this.todoRepository.setCompleted(id, isCompleted);

      // Update cache with new data
      await this.cacheManager.set(this.CACHE_KEYS.TODO(id), data);
      // Invalidate todos list cache
      await this.clearTodosCache();

      return {
        message: `Todo marked as ${isCompleted ? 'completed' : 'incomplete'}`,
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(
        `Failed to set completion status for todo ${id}`,
        error,
      );
      return {
        message: 'Failed to update todo completion status',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  async remove(id: string): Promise<ServiceResponse | any> {
    try {
      this.logger.log(`Removing todo with id: ${id}`);

      const existingTodo = await this.todoRepository.findById(id);

      if (!existingTodo) {
        this.logger.warn(`Todo with id ${id} not found for deletion`);
        return {
          message: 'Todo not found',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }

      const data = await this.todoRepository.delete(id);

      // Remove from cache
      await this.cacheManager.del(this.CACHE_KEYS.TODO(id));
      await this.clearTodosCache();

      return {
        message: 'Todo deleted successfully',
        data,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error(`Failed to delete todo with id: ${id}`, error);
      return {
        message: 'Failed to delete todo',
        error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
