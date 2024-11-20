import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Admin } from './admin.model';
import { User } from '../User/user.model';

const getAdminsIntoDB = async () => {
  try {
    const admins = await Admin.find();
    const adminEmails = admins.map((admin) => admin.email);

    const users = await User.find({ email: { $in: adminEmails } });

    const mergedData = admins.map((admin) => {
      const user = users.find((user) => user.email === admin.email);

      return {
        ...admin.toObject(),
        ...user?.toObject(),
      };
    });

    return mergedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to get admin data!');
  }
};

export const AdminServices = {
  getAdminsIntoDB,
};
