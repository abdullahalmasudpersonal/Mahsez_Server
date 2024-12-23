"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const buyer_constant_1 = require("../buyer/buyer.constant");
const adminSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'ID is required'],
        unique: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, 'User id is required'],
        unique: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender',
        },
        required: [false, 'Gender is not required'],
    },
    contactNo: {
        type: String,
        required: [false, 'Contact number is not required'],
    },
    city: {
        type: String,
        required: [false, 'City is not required'],
    },
    postCode: {
        type: String,
        required: [false, 'Post Code is not required'],
    },
    companyName: {
        type: String,
        required: [false, 'Company Name is not required'],
    },
    presentAddress: {
        type: String,
        required: [false, 'Present address is not required'],
    },
    onlineStatus: {
        type: String,
        enum: buyer_constant_1.onlineStatus,
        default: 'offline',
    },
    permanentAddress: {
        type: String,
        required: [false, 'Permanent address is not required'],
    },
    profileImg: { type: String, required: false },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Admin = (0, mongoose_1.model)('Admin', adminSchema);
