import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TRefreshToken = {
  _id?: mongoose.Types.ObjectId;
  token: string;
  userId: mongoose.Types.ObjectId;
  expiryDate: Date;
};
@Schema({ timestamps: true, collection: 'refreshToken' })
export class RefreshToken extends Document {
  declare _id: string;
  @Prop({
    type: String,
    required: true,
  })
  token: string;
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  userId: string;
  @Prop({ type: Date, required: true })
  expiryDate: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type RefreshTokenDocument = RefreshToken & Document;

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
