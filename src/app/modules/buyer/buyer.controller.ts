import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { BuyerServices } from './buyer.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getBuyers = catchAsync(async (req: Request, res: Response) => {
  const result = await BuyerServices.getBuyersIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get all buyer Successfully',
    data: result,
  });
});

const deleteBuyer = catchAsync(async (req: Request, res: Response) => {
  const result = await BuyerServices.deleteBuyerIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete buyer Successfully',
    data: result,
  });
});

export const BuyerController = {
  getBuyers,
  deleteBuyer,
};
