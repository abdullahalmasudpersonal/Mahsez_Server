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
        { $inc: { availableQuantity: -quantity, soldQuantity: +quantity } },
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

const getRevinewIntoDB = async (req: Request) => {
  // const { startDate, endDate } = req.body;
  // const today = new Date();
  // today.setHours(0, 0, 0, 0); // দিনের শুরুর সময় (মধ্যরাত 12:00 AM)
  // const tomorrow = new Date(today);
  // tomorrow.setDate(today.getDate() + 1);
  // const orders = await Order.find({
  //   createdAt: {
  //     $gte: today,
  //     $lt: tomorrow,
  //   },
  // }).exec(); // `.exec()` নিশ্চিত করবে যে এটি Promise থেকে রেজলভড ডেটা রিটার্ন করে
  // // টোটাল প্রাইস যোগ করা
  // const totalSales = orders.reduce((total, order) => {
  //   return total + (order.grandTotal || 0); // ধরে নিচ্ছি প্রতিটি অর্ডারের প্রাইস `totalPrice` ফিল্ডে আছে
  // }, 0);
  // console.log({ totalSales });
  // const todayStart = new Date();
  // todayStart.setHours(0, 0, 0, 0); // আজকের দিনের শুরুর সময় (মধ্যরাত ১২:০০ AM)
  // const todayEnd = new Date(todayStart);
  // todayEnd.setHours(23, 59, 59, 999); // আজকের দিনের শেষ সময় (রাত ১১:৫৯ PM)
  // const startDate = todayStart;
  // const endDate = todayEnd;
  // const dailyReport = await Order.aggregate([
  //   {
  //     $match: {
  //       isDeleted: false, // শুধুমাত্র ডিলিট না করা অর্ডার ফিল্টার
  //       // confirmOrder: true, // নিশ্চিত করা অর্ডার ফিল্টার
  //       createdAt: {
  //         $gte: new Date(startDate),
  //         $lt: new Date(endDate),
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
  //       }, // তারিখ অনুযায়ী গ্রুপ
  //       totalRevenue: { $sum: '$grandTotal' }, // মোট রেভিনিউ
  //       totalSubTotal: { $sum: '$subTotal' }, // মোট সাবটোটাল
  //       totalDeliveryCharge: { $sum: '$deliveryCharge' }, // মোট ডেলিভারি চার্জ
  //       totalProductsSold: { $sum: { $sum: '$items.quantity' } }, // বিক্রিত প্রোডাক্টের সংখ্যা
  //       totalOrders: { $count: {} }, // প্রতিদিনের মোট অর্ডারের সংখ্যা
  //     },
  //   },
  //   { $sort: { _id: -1 } }, // তারিখ অনুযায়ী ডেসেন্ডিং অর্ডারে সাজানো
  // ]);
  // return dailyReport.map((report) => ({
  //   date: report._id,
  //   totalRevenue: report.totalRevenue,
  //   totalSubTotal: report.totalSubTotal,
  //   totalDeliveryCharge: report.totalDeliveryCharge,
  //   totalProductsSold: report.totalProductsSold,
  //   totalOrders: report.totalOrders,
  // }));

  // const { startDate, endDate } = req.body;

  // const todayStart = new Date();
  // todayStart.setHours(0, 0, 0, 0); // আজকের দিনের শুরুর সময় (মধ্যরাত ১২:০০ AM)
  // const todayEnd = new Date(todayStart);
  // todayEnd.setHours(23, 59, 59, 999); // আজকের দিনের শেষ সময় (রাত ১১:৫৯ PM)

  // const lastWeekStart = new Date();
  // lastWeekStart.setDate(todayStart.getDate() - 7); // এক সপ্তাহ পূর্বের দিন
  // lastWeekStart.setHours(0, 0, 0, 0); // শুরু সময়
  // const lastWeekEnd = new Date(todayStart); // আজ পর্যন্ত
  // lastWeekEnd.setHours(23, 59, 59, 999); // শেষ সময়

  // const { startDate, endDate } = req.body;

  // // const startDate = lastWeekStart;
  // // const endDate = lastWeekEnd;

  // const orders = await Order.aggregate([
  //   {
  //     $match: {
  //       // confirmOrder: true,
  //       createdAt: {
  //         $gte: new Date(startDate),
  //         $lt: new Date(endDate),
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
  //       },
  //       totalRevenue: { $sum: '$grandTotal' },
  //       totalProductsSold: { $sum: { $sum: '$items.quantity' } },
  //       totalOrders: { $count: {} },
  //     },
  //   },
  //   { $sort: { _id: -1 } },
  // ]);
  // return orders;

  const result = await Order.aggregate([
    {
      $match: {
        isDeleted: false,
        confirmOrder: true,
      },
    },
    {
      $group: {
        _id: null, // গ্রুপিং প্রয়োজন নয়
        totalRevenue: { $sum: '$grandTotal' }, // মোট রেভিনিউ গণনা
      },
    },
  ]);
  return result.length > 0 ? result[0].totalRevenue : 0;
};

export const OrderServices = {
  createOrderIntoDB,
  getBuyerOrderIntoDB,
  getAllOrderIntoDB,
  getSingleOrderIntoDB,
  updateOrderStatusIntoDB,
  getRevinewIntoDB,
};
