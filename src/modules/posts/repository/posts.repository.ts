/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Post } from '../schema/posts.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
// import { UpdateTodoDto } from '../dto/update-todo.dto';
@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  setMongooseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
  async create(createTodoDto: CreatePostDto): Promise<Post> {
    //@ts-ignore
    createTodoDto.userId = this.setMongooseId(createTodoDto.userId);
    const createdTodo = new this.postModel(createTodoDto);
    return createdTodo.save();
  }

  async findAll({
    userId,
    query,
  }: {
    userId: string;
    query?: any;
  }): Promise<Post[]> {
    const mongooseId = this.setMongooseId(userId);
    return this.postModel.find({ userId: mongooseId, isDeleted: false }).exec();
  }

  async findById(id: string): Promise<Post | null> {
    const mongooseId = this.setMongooseId(id);
    return this.postModel.findOne({ _id: mongooseId, isDeleted: false }).exec();
  }

  // async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo | null> {
  //   return this.todoModel
  //     .findOneAndUpdate({ _id: id, isDeleted: false }, updateTodoDto, {
  //       new: true,
  //     })
  //     .exec();
  // }

  // async setCompleted(id: string, isCompleted: boolean): Promise<Todo | null> {
  //   return this.todoModel
  //     .findOneAndUpdate(
  //       { _id: id, isDeleted: false },
  //       { isCompleted: isCompleted },
  //       { new: true },
  //     )
  //     .exec();
  // }

  async delete(id: string): Promise<Post | null> {
    return this.postModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true },
      )
      .exec();
  }
  // async remove(id: string): Promise<Todo | null> {
  //   return this.todoModel.findByIdAndDelete(id).exec();
  // }
}
