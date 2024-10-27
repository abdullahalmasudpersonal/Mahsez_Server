import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const createBuyer = catchAsync(async (req, res) => {
  const buyerData = req?.body?.buyer;
  const result = await UserService.createBuyerIntoDB(
    req?.body?.password,
    buyerData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buyer Created Successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const adminData = req?.body?.admin;
  const result = await UserService.createAdminIntoDB(
    req?.body?.password,
    adminData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Created Successfully',
    data: result,
  });
});

export const UserController = {
  createBuyer,
  createAdmin,
};
