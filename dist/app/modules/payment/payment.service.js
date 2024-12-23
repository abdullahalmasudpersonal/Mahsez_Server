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
exports.PaymentServices = void 0;
const payment_model_1 = require("./payment.model");
const order_model_1 = require("../order/order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../Products/product.model");
const ssl_service_1 = require("../sslcommerz/ssl.service");
const mongoose_1 = __importDefault(require("mongoose"));
const initPaymentIntoDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const [paymentData] = yield payment_model_1.Payment.aggregate([
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
            amount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
            transactionId: paymentData === null || paymentData === void 0 ? void 0 : paymentData.transactionId,
            name: (_a = paymentData === null || paymentData === void 0 ? void 0 : paymentData.orderDetails) === null || _a === void 0 ? void 0 : _a.name,
            email: (_b = paymentData === null || paymentData === void 0 ? void 0 : paymentData.orderDetails) === null || _b === void 0 ? void 0 : _b.email,
            address: (_c = paymentData === null || paymentData === void 0 ? void 0 : paymentData.orderDetails) === null || _c === void 0 ? void 0 : _c.address,
            contactNumber: (_d = paymentData === null || paymentData === void 0 ? void 0 : paymentData.orderDetails) === null || _d === void 0 ? void 0 : _d.contactNumber,
        };
        const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
        return { paymentUrl: result === null || result === void 0 ? void 0 : result.GatewayPageURL };
    }
    catch (error) {
        console.log(error);
    }
});
const validatePaymentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updatePaymentStatus = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: response === null || response === void 0 ? void 0 : response.tran_id }, { $set: { paymentStatus: 'PAID', paymentGetwayData: response } }, { new: true });
        yield order_model_1.Order.updateOne({ orderId: updatePaymentStatus === null || updatePaymentStatus === void 0 ? void 0 : updatePaymentStatus.orderId }, {
            $set: {
                paymentStatus: 'PAID',
                confirmOrder: true,
                confirmOrderDate: new Date(),
                orderStatus: 'Confirm',
            },
        });
        yield session.commitTransaction();
        yield session.endSession();
        return response;
    }
    catch (err) {
        console.log(err);
    }
});
const getBuyerPaymentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const orders = yield order_model_1.Order.find({ email: email }).select([
        'orderId',
        'items',
    ]);
    if (!orders) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No order found!');
    }
    const orderIds = orders.map((order) => order.orderId);
    const paymentData = yield payment_model_1.Payment.find({
        orderId: { $in: orderIds },
    });
    if (!paymentData || paymentData.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No payment data found!');
    }
    const productIds = orders.flatMap((order) => order.items.map((item) => item.product_id));
    const products = yield product_model_1.Product.find({ _id: { $in: productIds } }).select([
        'name',
        'image',
    ]);
    const paymentDataWithItemsAndProductNames = paymentData.map((payment) => {
        const order = orders.find((order) => order.orderId === payment.orderId);
        const itemsWithProductNames = order === null || order === void 0 ? void 0 : order.items.map((item) => {
            var _a;
            const product = products.find((product) => product._id.equals(item.product_id));
            return {
                name: product ? product.name : 'Unknown Product',
                image: product ? (_a = product.image) === null || _a === void 0 ? void 0 : _a[0] : 'Unknown Product',
            };
        });
        return Object.assign(Object.assign({}, payment.toObject()), { items: itemsWithProductNames });
    });
    return paymentDataWithItemsAndProductNames;
});
exports.PaymentServices = {
    initPaymentIntoDB,
    validatePaymentIntoDB,
    getBuyerPaymentIntoDB,
};
