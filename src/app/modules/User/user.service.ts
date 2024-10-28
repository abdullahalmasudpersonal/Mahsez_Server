import mongoose from 'mongoose';
import { User } from './user.model';
import { TUser } from './user.interface';
import { generateAdminId, generatebuyerId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TBuyer } from '../buyer/buyer.interface';
import { Buyer } from '../buyer/buyer.model';
import { Admin } from '../admin/admin.model';

const createBuyerIntoDB = async (password: string, payload: TBuyer) => {
  const existsUser = await User.findOne({ email: payload?.email });

  if (existsUser) {
    throw new AppError(409, 'User Alrady Exists!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: Partial<TUser> = {};

    userData.id = await generatebuyerId();
    userData.email = payload?.email;
    userData.password = password;
    userData.role = 'buyer';

    const createNewUser = await User.create([userData], { session });

    if (!createNewUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = createNewUser[0].id;
    payload.user = createNewUser[0]._id;

    const createNewBuyer = await Buyer.create([payload], { session });

    if (!createNewBuyer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create buyer');
    }

    await session.commitTransaction();
    await session.endSession();
    return createNewBuyer;
  } catch (err: any) {
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TBuyer) => {
  const existsUser = await User.findOne({ email: payload?.email });

  if (existsUser) {
    throw new AppError(409, 'User Alrady Exists!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userData: Partial<TUser> = {};

    userData.id = await generateAdminId();
    userData.email = payload?.email;
    userData.password = password;
    userData.role = 'admin';

    const createNewUser = await User.create([userData], { session });

    if (!createNewUser?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = createNewUser[0].id;
    payload.user = createNewUser[0]._id;

    const createNewAdmin = await Admin.create([payload], { session });

    if (!createNewAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();
    return createNewAdmin;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const UserServices = {
  createBuyerIntoDB,
  createAdminIntoDB,
};
