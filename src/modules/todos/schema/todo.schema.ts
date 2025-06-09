import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'todos' })
export class Todo {
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  userId: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export type TodoDocument = Todo & Document;

export const TodoSchema = SchemaFactory.createForClass(Todo);
