import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'buyer';
  status: 'active' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
}

export type TUserRole = keyof typeof USER_ROLE;
