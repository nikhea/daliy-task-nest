export interface TUser {
  _id: string;
  email: string;
  password: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}
