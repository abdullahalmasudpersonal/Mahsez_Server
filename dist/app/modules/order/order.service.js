"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const order_utils_1 = require("./order.utils");
const payment_model_1 = require("../payment/payment.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../Products/product.model");
const payment_utils_1 = __importDefault(require("../payment/payment.utils"));
const createOrderIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orderData = req === null || req === void 0 ? void 0 : req.body;
    const user = req === null || req === void 0 ? void 0 : req.user;
    const paymentData = {};
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        orderData.orderId = yield (0, order_utils_1.generateOrderId)();
        orderData.userId = user.userId;
        const createOrder = yield order_model_1.Order.create([orderData], { session });
        if (!(createOrder === null || createOrder === void 0 ? void 0 : createOrder.length)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create order!');
        }
        ///////// Updae product quantity
        const [productOrderQuantity] = createOrder;
        const orderItems = productOrderQuantity === null || productOrderQuantity === void 0 ? void 0 : productOrderQuantity.items;
        // Loop through each item to update product quantity
        for (const item of orderItems) {
            const { product_id, quantity } = item;
            // Update the product quantity
            yield product_model_1.Product.findByIdAndUpdate(product_id, { $inc: { availableQuantity: -quantity, soldQuantity: +quantity } }, { session, new: true });
        }
        paymentData.transactionId = yield (0, payment_utils_1.default)();
        paymentData.orderId = createOrder[0].orderId;
        paymentData.amount = createOrder[0].grandTotal;
        paymentData.paymentStatus = createOrder[0].paymentStatus;
        paymentData.orderStatus = createOrder[0].orderStatus;
        paymentData.paymentType = createOrder[0].paymentType;
        paymentData.paymentNumber = createOrder[0].paymentNumber;
        const createPayment = yield payment_model_1.Payment.create([paymentData], { session });
        if (!createPayment.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create payment!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createOrder;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getBuyerOrderIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req === null || req === void 0 ? void 0 : req.user;
    return yield order_model_1.Order.find({ email: email }).sort({ createdAt: -1 });
});
const getAllOrderIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return yield order_model_1.Order.find().sort({ createdAt: -1 });
});
const getSingleOrderIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    return yield order_model_1.Order.findOne({ _id });
});
const updateOrderStatusIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const currentDate = new Date();
    const updateOrderStatusData = req.body;
    const updateData = {};
    try {
        const session = yield mongoose_1.default.startSession();
        if (updateOrderStatusData === null || updateOrderStatusData === void 0 ? void 0 : updateOrderStatusData.confirmOrder) {
            updateData.confirmOrder = true;
            updateData.confirmOrderDate = currentDate;
            updateData.orderStatus = 'Confirm';
        }
        else if (updateOrderStatusData === null || updateOrderStatusData === void 0 ? void 0 : updateOrderStatusData.deliveredOrder) {
            updateData.deliveredOrder = true;
            updateData.deliveredOrderDate = currentDate;
            updateData.orderStatus = 'Delivered';
        }
        else if (updateOrderStatusData === null || updateOrderStatusData === void 0 ? void 0 : updateOrderStatusData.cancelOrder) {
            updateData.cancelOrder = true;
            updateData.cancelOrderDate = currentDate;
            updateData.orderStatus = 'Canceled';
        }
        else if (updateOrderStatusData === null || updateOrderStatusData === void 0 ? void 0 : updateOrderStatusData.fakeOrder) {
            updateData.fakeOrder = true;
            updateData.fakeOrderDate = currentDate;
            updateData.orderStatus = 'Fake';
        }
        const update = order_model_1.Order.updateOne({ _id: orderId }, { $set: updateData });
        yield session.commitTransaction();
        yield session.endSession();
        return update;
    }
    catch (error) { }
    const update = order_model_1.Order.updateOne({ _id: orderId }, { $set: updateData });
    return update;
});
const getRevinewIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield order_model_1.Order.aggregate([
        {
            $match: {
                isDeleted: false,
                confirmOrder: true,
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$grandTotal' }, // মোট রেভিনিউ গণনা
            },
        },
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
});
exports.OrderServices = {
    createOrderIntoDB,
    getBuyerOrderIntoDB,
    getAllOrderIntoDB,
    getSingleOrderIntoDB,
    updateOrderStatusIntoDB,
    getRevinewIntoDB,
};
