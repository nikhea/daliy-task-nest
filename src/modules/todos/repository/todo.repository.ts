import { Injectable } from '@nestjs/common';
import { Todo } from '../schema/todo.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
@Injectable()
export class TodoRepository {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: Model<Todo>,
  ) {}
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = new this.todoModel(createTodoDto);
    return createdTodo.save();
  }
  async findAll(): Promise<Todo[]> {
    return this.todoModel.find({ isDeleted: false }).exec();
  }
  async findById(id: string): Promise<Todo | null> {
    return this.todoModel.findOne({ _id: id, isDeleted: false }).exec();
  }
  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
    return this.todoModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateTodoDto, {
        new: true,
      })
      .exec();
  }

  async setCompleted(id: string, isCompleted: boolean): Promise<Todo | null> {
    return this.todoModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isCompleted: isCompleted },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<Todo | null> {
    return this.todoModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();
  }
  async remove(id: string): Promise<Todo | null> {
    return this.todoModel.findByIdAndDelete(id).exec();
  }
}
