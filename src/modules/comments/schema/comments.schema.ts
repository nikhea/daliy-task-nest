import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true })
  authorId: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true })
  postId: string;

  @Prop({ type: Number, default: 0 })
  likes: number;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
