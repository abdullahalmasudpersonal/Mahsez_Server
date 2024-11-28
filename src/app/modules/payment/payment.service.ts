import { Request } from 'express';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../Products/product.model';
import config from '../../config';
import axios from 'axios';
import { TPayment } from './payment.interface';
import { SSLService } from '../sslcommerz/ssl.service';

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

  // const { bookingId } = req.params;
  // const paymentDta = await prisma.payment.findFirstOrThrow({
  //   where: {
  //     bookingId: bookingId,
  //   },
  //   select: {
  //     transactionId: true,
  //     amount: true,
  //     booking: {
  //       select: {
  //         user: {
  //           select: {
  //             buyer: {
  //               select: {
  //                 name: true,
  //                 email: true,
  //                 contactNumber: true,
  //                 address: true,
  //               },
  //             },
  //           },
  //         },
  //         flat: {
  //           select: {
  //             flatName: true,
  //             flatNo: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // const initPaymentData = {
  //   total_amount: paymentDta?.amount,
  //   transactionId: paymentDta?.transactionId,
  //   product_name: paymentDta?.booking?.flat?.flatName,
  //   cus_name: paymentDta?.booking?.user?.buyer?.name || '',
  //   cus_email: paymentDta?.booking?.user?.buyer?.email || '',
  //   cus_address: paymentDta?.booking?.user?.buyer?.address || '',
  //   cus_phone: paymentDta?.booking?.user?.buyer?.contactNumber || '',
  // };
  // const result = await SSLService.initPayment(initPaymentData);
  // return { paymentUrl: result?.GatewayPageURL };
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
      items: itemsWithProductNames, // নতুন items সহ যুক্ত করছি
    };
  });

  return paymentDataWithItemsAndProductNames;
};

export const PaymentServices = {
  initPaymentIntoDB,
  getBuyerPaymentIntoDB,
};
