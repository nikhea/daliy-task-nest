import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from '../dto/create-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
  setMongooseId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  async create(createUserDto: CreateAuthDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find({ isDeleted: false }).exec();
  }
  async findById(id: string): Promise<User | null> {
    return this.userModel
      .findOne({ _id: id, isDeleted: false })
      .populate('password')
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isDeleted: false }).exec();
  }

  async findByUserId(userId: mongoose.Types.ObjectId): Promise<User | null> {
    return this.userModel.findOne({ _id: userId, isDeleted: false }).exec();
  }
}
