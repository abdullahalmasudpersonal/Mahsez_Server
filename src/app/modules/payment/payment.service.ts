import { Request } from 'express';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../Products/product.model';

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
      items: itemsWithProductNames, // নতুন items সহ যুক্ত করছি
    };
  });

  return paymentDataWithItemsAndProductNames;
};

export const PaymentServices = {
  getBuyerPaymentIntoDB,
};
