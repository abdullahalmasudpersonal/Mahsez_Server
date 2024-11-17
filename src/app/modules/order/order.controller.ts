import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { OrderServices } from './order.service';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.createOrderIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Placed Successfully',
    data: result,
  });
});

const getBuyerOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getBuyerOrderIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get buyer order Successfully',
    data: result,
  });
});

const GetAllorder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrderIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'GEt all order Successfully',
    data: result,
  });
});

const GetSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getSingleOrderIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'GEt single order Successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getBuyerOrder,
  GetAllorder,
  GetSingleOrder,
};
