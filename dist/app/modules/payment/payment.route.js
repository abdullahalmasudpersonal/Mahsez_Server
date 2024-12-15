"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PyamentRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post('/init-payment/:orderId', payment_controller_1.PaymentController.initPayment);
router.post('/ipn', payment_controller_1.PaymentController.validatePayment);
// router.post('/success/:transactionId', PaymentController.validatePayment);
router.get('/buyer-payment', (0, auth_1.default)(user_constant_1.USER_ROLE.buyer, user_constant_1.USER_ROLE.admin), payment_controller_1.PaymentController.getBuyerPayment);
exports.PyamentRoutes = router;
