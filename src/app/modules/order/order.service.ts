import { Request } from 'express';
import mongoose from 'mongoose';
import { Order } from './order.mode';
import { generateOrderId } from './order.utils';
import { Payment } from '../payment/payment.model';
import { TPayment } from '../payment/payment.interface';
import generateTransactionId from '../payment/payment.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createOrderIntoDB = async (req: Request) => {
  const orderData = req?.body;
  const user = req?.user;
  const paymentData: Partial<TPayment> = {};

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    orderData.orderId = await generateOrderId();
    orderData.userId = user.userId;
    const createOrder = await Order.create([orderData], { session });
    console.log(createOrder);
    if (!createOrder?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order!');
    }

    paymentData.transactionId = await generateTransactionId();
    paymentData.orderId = createOrder[0].orderId;
    paymentData.amount = createOrder[0].grandTotal;
    paymentData.paymentStatus = createOrder[0].paymentStatus;
    paymentData.orderStatus = createOrder[0].orderStatus;
    paymentData.paymentType = createOrder[0].paymentType;
    paymentData.paymentNumber = createOrder[0].paymentNumber;

    const createPayment = await Payment.create([paymentData], { session });

    if (!createPayment.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payment!');
    }

    await session.commitTransaction();
    await session.endSession();
    return createOrder;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const OrderServices = {
  createOrderIntoDB,
};
