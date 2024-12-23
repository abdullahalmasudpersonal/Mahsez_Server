import { Request } from 'express';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../Products/product.model';
import { SSLService } from '../sslcommerz/ssl.service';
import mongoose from 'mongoose';

const initPaymentIntoDB = async (orderId: string) => {
  const [paymentData] = await Payment.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: 'orderId',
        as: 'orderDetails',
      },
    },
    {
      $match: {
        orderId: orderId,
      },
    },
    {
      $unwind: '$orderDetails',
    },
    {
      $project: {
        orderId: 1,
        amount: 1,
        transactionId: 1,
        'orderDetails.email': 1,
        'orderDetails.name': 1,
        'orderDetails.contactNumber': 1,
        'orderDetails.address': 1,
        'orderDetails.deliveryCharge': 1,
      },
    },
  ]);

  try {
    const initPaymentData = {
      amount: paymentData?.amount,
      transactionId: paymentData?.transactionId,
      name: paymentData?.orderDetails?.name,
      email: paymentData?.orderDetails?.email,
      address: paymentData?.orderDetails?.address,
      contactNumber: paymentData?.orderDetails?.contactNumber,
    };

    const result = await SSLService.initPayment(initPaymentData);
    return { paymentUrl: result?.GatewayPageURL };
  } catch (error) {
    console.log(error);
  }
};

const validatePaymentIntoDB = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //   return { message: 'Invalid Payment!' };
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response?.status !== 'VALID') {
  //   return {
  //     message: 'Payment Failed!',
  //   };
  // }

  // const tran_id = payload;
  // const response = { tran_id };
  // console.log(response);
  const response = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const updatePaymentStatus = await Payment.findOneAndUpdate(
      { transactionId: response?.tran_id },
      { $set: { paymentStatus: 'PAID', paymentGetwayData: response } },
      { new: true },
    );

    await Order.updateOne(
      { orderId: updatePaymentStatus?.orderId },
      {
        $set: {
          paymentStatus: 'PAID',
          confirmOrder: true,
          confirmOrderDate: new Date(),
          orderStatus: 'Confirm',
        },
      },
    );

    await session.commitTransaction();
    await session.endSession();
    return response;
  } catch (err) {
    console.log(err);
  }
};

const getBuyerPaymentIntoDB = async (req: Request) => {
  const { email } = req.user;

  const orders = await Order.find({ email: email }).select([
    'orderId',
    'items',
  ]);

  if (!orders) {
    throw new AppError(httpStatus.NOT_FOUND, 'No order found!');
  }
  const orderIds = orders.map((order) => order.orderId);

  const paymentData = await Payment.find({
    orderId: { $in: orderIds },
  });

  if (!paymentData || paymentData.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No payment data found!');
  }

  const productIds = orders.flatMap((order) =>
    order.items.map((item) => item.product_id),
  );
  const products = await Product.find({ _id: { $in: productIds } }).select([
    'name',
    'image',
  ]);

  const paymentDataWithItemsAndProductNames = paymentData.map((payment) => {
    const order = orders.find((order) => order.orderId === payment.orderId);

    const itemsWithProductNames = order?.items.map((item) => {
      const product = products.find((product) =>
        product._id.equals(item.product_id),
      );
      return {
        name: product ? product.name : 'Unknown Product',
        image: product ? product.image?.[0] : 'Unknown Product',
      };
    });

    return {
      ...payment.toObject(),
      items: itemsWithProductNames,
    };
  });

  return paymentDataWithItemsAndProductNames;
};

export const PaymentServices = {
  initPaymentIntoDB,
  validatePaymentIntoDB,
  getBuyerPaymentIntoDB,
};
