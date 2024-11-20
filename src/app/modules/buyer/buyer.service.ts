import { Request } from 'express';
import { Buyer } from './buyer.model';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getBuyersIntoDB = async () => {
  try {
    const buyers = await Buyer.find();
    const buyerEmails = buyers.map((buyer) => buyer.email);

    const users = await User.find({ email: { $in: buyerEmails } });

    const mergedData = buyers.map((buyer) => {
      const user = users.find((user) => user.email === buyer.email);

      return {
        ...buyer.toObject(),
        ...user?.toObject(),
      };
    });

    return mergedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to get buyer data!');
  }
};

export const BuyerServices = {
  getBuyersIntoDB,
};
