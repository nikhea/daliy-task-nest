/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../schema/comments.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  setMongooseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    //@ts-ignore
    createCommentDto.authorId = this.setMongooseId(createCommentDto.authorId);
    //@ts-ignore
    createCommentDto.postId = this.setMongooseId(createCommentDto.postId);
    //@ts-ignore
    if (createCommentDto.parentId) {
      //@ts-ignore
      createCommentDto.parentId = this.setMongooseId(createCommentDto.parentId);
    }
    const comment = new this.commentModel(createCommentDto);
    return comment.save();
  }

  async findAllByPostId(postId: string): Promise<Comment[]> {
    const mongoosePostId = this.setMongooseId(postId);
    return this.commentModel.find({ postId: mongoosePostId }).exec();
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  async delete(id: string): Promise<Comment | null> {
    return this.commentModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: true } },
        { new: true },
      )
      .exec();
  }
}
