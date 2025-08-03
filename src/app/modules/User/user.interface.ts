import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'buyer';
  status: 'active' | 'blocked';
  ipAddress: string;
  isOnline: boolean;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
