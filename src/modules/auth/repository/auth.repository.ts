import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from '../dto/create-auth.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}
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
}
