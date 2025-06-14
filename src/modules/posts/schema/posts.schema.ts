import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'post' })
export class Post {
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

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  coverImage: string;

  @Prop({ type: String })
  images: [string];

  @Prop({ type: Date, default: Date.now, required: true })
  date: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
