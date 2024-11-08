import mongoose from 'mongoose';
import { User } from './user.model';
import { TUser } from './user.interface';
import { generateAdminId, generatebuyerId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TBuyer } from '../buyer/buyer.interface';
import { Buyer } from '../buyer/buyer.model';
import { Admin } from '../admin/admin.model';
import { Request } from 'express';
import { IUploadFile } from '../../interface/file';
import { USER_ROLE } from './user.constant';

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

const getMeIntoDB = async (userId: string, role: string) => {
  let result = null;
  if (role === 'buyer') {
    result = await Buyer.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }
  if (role === 'superAdmin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  return result;
};

const updateMyProfileIntoDB = async (req: Request) => {
  const user = req?.user;
  const userData = await User.findOne({ email: user?.email });
  if (!userData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exists!');
  }
  const file = req.file as IUploadFile;
  req.body.profileImg = file?.path;

  let profileData;

  if (userData?.role === USER_ROLE.superAdmin) {
    profileData = await Admin.findOneAndUpdate(
      { email: userData?.email },
      { $set: req.body },
    );
  } else if (userData?.role === USER_ROLE.admin) {
    profileData = await Admin.findOneAndUpdate(
      { email: userData?.email },
      { $set: req.body },
    );
  } else if (userData?.role === USER_ROLE.buyer) {
    profileData = await Buyer.findOneAndUpdate(
      { email: userData?.email },
      { $set: req.body },
    );
  }
  return profileData;
};

export const UserServices = {
  createBuyerIntoDB,
  createAdminIntoDB,
  getMeIntoDB,
  updateMyProfileIntoDB,
};
