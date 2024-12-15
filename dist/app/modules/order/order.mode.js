"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderItemSchema = new mongoose_1.Schema({
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
});
const orderSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: false,
    },
    items: {
        type: [OrderItemSchema],
        required: true,
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
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PAID'],
        required: true,
        default: 'UNPAID',
    },
    paymentNumber: {
        type: String,
        required: false,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
