export interface TUser {
  _id: string;
  email: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}
