import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { Request, Response } from 'express';

const createBuyer = catchAsync(async (req, res) => {
  const buyerData = req?.body?.buyer;
  const result = await UserServices.createBuyerIntoDB(
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
  const result = await UserServices.createAdminIntoDB(
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

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMeIntoDB(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get my profile successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserServices.updateMyProfileIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update your profile successfully',
    data: result,
  });
});

export const UserController = {
  createBuyer,
  createAdmin,
  getMe,
  updateMyProfile,
};
