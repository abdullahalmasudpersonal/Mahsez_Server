import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken } from './auth.utils';
import { Buyer } from '../buyer/buyer.model';
import { Admin } from '../admin/admin.model';
import { Request } from 'express';
import requestIp from 'request-ip';

const loginUserIntoDB = async (req: Request) => {
  const payload: TLoginUser = req.body;

  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password is incorrect!');

  let jwtPayload: {
    userId: string;
    role: string;
    email?: string;
    buyer?: any;
    admin?: any;
  };

  if (user.role === 'buyer') {
    const buyer = await Buyer.findOne({ user: user?._id });
    jwtPayload = {
      buyer:buyer?._id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  } else if (user.role === 'admin') {
    const admin = await Admin.findOne({ user: user?._id });
    jwtPayload = {
      admin:admin?._id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  } else if (user.role === 'superAdmin') {
    const admin = await Admin.findOne({ user: user?._id });
    jwtPayload = {
      admin:admin?._id,
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  } else {
    throw new Error('Invalid role');
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_token_expires_in as string,
  );

  if (user.role === 'buyer') {
    await Buyer.updateOne(
      { email: user?.email },
      { $set: { onlineStatus: 'online' } },
    );
  }
  if (user.role === 'admin') {
    await Admin.updateOne(
      { email: user?.email },
      { $set: { onlineStatus: 'online' } },
    );
  }
  if (user.role === 'superAdmin') {
    await Admin.updateOne(
      { email: user?.email },
      { $set: { onlineStatus: 'online' } },
    );
  }

  //   const token = req.headers.authorization || '';
  // const base64Url = token.split('.')[1];
  // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  // const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

  const ip = requestIp.getClientIp(req);
  await User.updateOne({ email: payload?.email }, { ipAddress: ip });

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUserIntoDB,
};
