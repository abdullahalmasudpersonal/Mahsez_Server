import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AdminServices } from './admin.service';

const getAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAdminsIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all admin Successfully',
    data: result,
  });
});

const updateOnlineStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.updateOnlineStatusIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update admin online status successfully',
    data: result,
  });
});

export const AdminController = {
  getAdmins,
  updateOnlineStatus,
};
