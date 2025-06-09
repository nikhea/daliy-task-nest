/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ResetToken,
  ResetTokenDocument,
  TResetToken,
} from '../schema/reset-token.shcema';

@Injectable()
export class ResetTokenRepository {
  constructor(
    @InjectModel(ResetToken.name)
    private readonly refreshTokenModel: Model<ResetTokenDocument>,
  ) {}

  setMongooseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  async create(createUserDto: TResetToken | any): Promise<ResetToken> {
    const createdUser = new this.refreshTokenModel(createUserDto);
    return createdUser.save();
  }

  async findOne(token: string): Promise<ResetToken | null> {
    return this.refreshTokenModel
      .findOneAndDelete({
        token,
        expiryDate: { $gt: new Date() },
        isDeleted: false,
      })
      .exec();
  }

  async findOneAndDelete(token: string): Promise<ResetToken | null> {
    return this.refreshTokenModel
      .findOneAndDelete({
        token,
        expiryDate: { $gt: new Date() },
        isDeleted: false,
      })
      .exec();
  }

  // New method: Find refresh token by userId
  async findByUserId(
    userId: mongoose.Types.ObjectId,
  ): Promise<ResetToken | null> {
    return this.refreshTokenModel
      .findOne({
        userId,
        expiryDate: { $gt: new Date() },
        isDeleted: false,
      })
      .exec();
  }

  // New method: Delete refresh tokens by userId
  async deleteByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
    await this.refreshTokenModel
      .updateMany(
        {
          userId,
          isDeleted: false,
        },
        {
          $set: { isDeleted: true },
        },
      )
      .exec();
  }

  // Alternative: Hard delete by userId (if you prefer actual deletion)
  async hardDeleteByUserId(userId: mongoose.Types.ObjectId): Promise<void> {
    await this.refreshTokenModel
      .deleteMany({
        userId,
      })
      .exec();
  }

  // New method: Update existing refresh token
  async update(
    id: mongoose.Types.ObjectId,
    updateData: Partial<TResetToken>,
  ): Promise<ResetToken | null> {
    return this.refreshTokenModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }

  // New method: Upsert (update or insert)
  async upsert(
    filter: Partial<TResetToken>,
    updateData: TResetToken,
  ): Promise<ResetToken> {
    return this.refreshTokenModel
      .findOneAndUpdate(
        filter,
        { $set: updateData },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  // New method: Delete by token ID
  async delete(id: mongoose.Types.ObjectId): Promise<void> {
    await this.refreshTokenModel
      .findByIdAndUpdate(id, { $set: { isDeleted: true } })
      .exec();
  }

  // Alternative: Hard delete by ID
  async hardDelete(id: mongoose.Types.ObjectId): Promise<void> {
    await this.refreshTokenModel.findByIdAndDelete(id).exec();
  }
}
