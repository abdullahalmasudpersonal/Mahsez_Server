"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        required: true,
        default: 'UNPAID',
    },
    orderStatus: {
        type: String,
        enum: {
            values: ['Pneding', 'Fake', 'Confirm', 'Canceled', 'Delivered'],
        },
        required: true,
        default: 'Pneding',
    },
    paymentType: {
        type: String,
        enum: {
            values: ['Cash On Delivery', 'Online Payment', 'Mobile Banking'],
        },
        required: true,
    },
    paymentNumber: {
        type: String,
        required: false,
    },
    paymentGetwayData: {
        type: JSON,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
