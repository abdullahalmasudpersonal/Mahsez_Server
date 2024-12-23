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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const result = yield payment_service_1.PaymentServices.initPaymentIntoDB(orderId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'payment initiate successfully',
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.validatePaymentIntoDB(req.query);
    const { tran_id, amount } = result;
    console.log(result, 'result');
    res.redirect(`http://localhost:5173/dashboard/payment-success?tran_id=${tran_id}&amount=${amount}`);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: 'payment validate successfully',
    //   data: result,
    //   // data: result?.message,
    // });
}));
const getBuyerPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.getBuyerPaymentIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order Placed Successfully',
        data: result,
    });
}));
exports.PaymentController = {
    initPayment,
    validatePayment,
    getBuyerPayment,
};
