import { Request } from 'express';
import mongoose from 'mongoose';
import { Order } from './order.model';
import { generateOrderId } from './order.utils';
import { Payment } from '../payment/payment.model';
import { TPayment } from '../payment/payment.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Products/product.model';
import generateTransactionId from '../payment/payment.utils';

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

    if (!createOrder?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order!');
    }

    ///////// Updae product quantity
    const [productOrderQuantity] = createOrder;
    const orderItems = productOrderQuantity?.items;
    // Loop through each item to update product quantity
    for (const item of orderItems) {
      const { product_id, quantity } = item;
      // Update the product quantity
      await Product.findByIdAndUpdate(
        product_id,
        { $inc: { availableQuantity: -quantity } },
        { session, new: true },
      );
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

const getBuyerOrderIntoDB = async (req: Request) => {
  const { email } = req?.user;
  return await Order.find({ email: email }).sort({ createdAt: -1 });
};

const getAllOrderIntoDB = async (req: Request) => {
  return await Order.find().sort({ createdAt: -1 });
};

const getSingleOrderIntoDB = async (req: Request) => {
  const _id = req.params.id;
  return await Order.findOne({ _id });
};

const updateOrderStatusIntoDB = async (req: Request) => {
  const orderId = req.params.id;
  const currentDate = new Date();
  const updateOrderStatusData = req.body;

  const updateData: any = {};

  // console.log(updateData);

  try {
    const session = await mongoose.startSession();

    if (updateOrderStatusData?.confirmOrder) {
      updateData.confirmOrder = true;
      updateData.confirmOrderDate = currentDate;
      updateData.orderStatus = 'Confirm';
    } else if (updateOrderStatusData?.deliveredOrder) {
      updateData.deliveredOrder = true;
      updateData.deliveredOrderDate = currentDate;
      updateData.orderStatus = 'Delivered';
    } else if (updateOrderStatusData?.cancelOrder) {
      updateData.cancelOrder = true;
      updateData.cancelOrderDate = currentDate;
      updateData.orderStatus = 'Canceled';
    } else if (updateOrderStatusData?.fakeOrder) {
      updateData.fakeOrder = true;
      updateData.fakeOrderDate = currentDate;
      updateData.orderStatus = 'Fake';
    }
    const update = Order.updateOne({ _id: orderId }, { $set: updateData });

    await session.commitTransaction();
    await session.endSession();
    return update;
  } catch (error) {}

  const update = Order.updateOne({ _id: orderId }, { $set: updateData });
  return update;
};

export const OrderServices = {
  createOrderIntoDB,
  getBuyerOrderIntoDB,
  getAllOrderIntoDB,
  getSingleOrderIntoDB,
  updateOrderStatusIntoDB,
};
