import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PaymentServices } from './payment.service';

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const result = await PaymentServices.initPaymentIntoDB(orderId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'payment initiate successfully',
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.validatePaymentIntoDB(req.query);
  const { tran_id, amount } = result;
  res.redirect(
    `https://mahsez.vercel.app/dashboard/payment-success?tran_id=${tran_id}&amount=${amount}`,
  );
  // sendResponse(res, {
  //   success: true,
  //   statusCode: httpStatus.OK,
  //   message: 'payment validate successfully',
  //   data: result,
  //   // data: result?.message,
  // });
});

const getBuyerPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.getBuyerPaymentIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order Placed Successfully',
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
  getBuyerPayment,
};
