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
    message: 'Get all order Successfully',
    data: result,
  });
});

const GetSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getSingleOrderIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get single order Successfully',
    data: result,
  });
});

const updateOrderstatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.updateOrderStatusIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update order status Successfully',
    data: result,
  });
});

const getRevinew = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getRevinewIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get revinew  Successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getBuyerOrder,
  GetAllorder,
  GetSingleOrder,
  updateOrderstatus,
  getRevinew,
};
