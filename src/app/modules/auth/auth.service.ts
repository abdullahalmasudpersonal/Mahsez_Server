import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { createToken } from './auth.utils';
import { Buyer } from '../buyer/buyer.model';
import { Admin } from '../admin/admin.model';
const loginUserIntoDB = async (payload: TLoginUser) => {
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

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

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

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUserIntoDB,
};
