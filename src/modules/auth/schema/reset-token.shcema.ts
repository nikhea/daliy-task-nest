import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TResetToken = {
  _id?: mongoose.Types.ObjectId;
  token: string;
  userId: mongoose.Types.ObjectId;
  expiryDate: Date;
};
@Schema({ timestamps: true, collection: 'resetToken' })
export class ResetToken extends Document {
  declare _id: string;
  @Prop({
    type: String,
    required: true,
  })
  token: string;
  @Prop({ type: mongoose.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ type: Date, required: true, expires: 0 })
  expiryDate: Date;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type ResetTokenDocument = ResetToken & Document;

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
