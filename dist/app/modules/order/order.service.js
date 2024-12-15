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
    // console.log(updateData);
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
exports.OrderServices = {
    createOrderIntoDB,
    getBuyerOrderIntoDB,
    getAllOrderIntoDB,
    getSingleOrderIntoDB,
    updateOrderStatusIntoDB,
};
