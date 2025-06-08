import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
  TRefreshToken,
} from '../schema/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  setMongooseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  async create(createUserDto: TRefreshToken): Promise<RefreshToken> {
    const createdUser = new this.refreshTokenModel(createUserDto);
    return createdUser.save();
  }

  async findOne(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel
      .findOneAndDelete({
        token,
        expiryDate: { $gt: new Date() },
        isDeleted: false,
      })
      .exec();
  }

  async findOneAndDelete(token: string): Promise<RefreshToken | null> {
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
  ): Promise<RefreshToken | null> {
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
    updateData: Partial<TRefreshToken>,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
  }

  // New method: Upsert (update or insert)
  async upsert(
    filter: Partial<TRefreshToken>,
    updateData: TRefreshToken,
  ): Promise<RefreshToken> {
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
