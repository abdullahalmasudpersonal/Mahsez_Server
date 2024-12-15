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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = void 0;
const order_model_1 = require("./order.model");
const findLastOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrder = yield order_model_1.Order.findOne({}, {
        orderId: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastOrder === null || lastOrder === void 0 ? void 0 : lastOrder.orderId) ? lastOrder.orderId : undefined;
});
const generateOrderId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastOrderId = yield findLastOrderId();
    const lastIdNumber = lastOrderId ? parseInt(lastOrderId.slice(-6)) : 0;
    const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');
    const orderId = `ORD${incrementId}`;
    return orderId;
});
exports.generateOrderId = generateOrderId;
