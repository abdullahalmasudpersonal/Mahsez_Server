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
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    productId: {
        type: String,
        required: true,
        unique: true,
    },
    mainCategory: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    availableQuantity: {
        type: Number,
        required: true,
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Out Of Stock'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    purchaseprice: {
        type: Number,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: false,
    },
    profit: {
        type: Number,
        required: false,
    },
    size: {
        type: String,
        required: true,
    },
    features: {
        type: String,
        required: true,
    },
    features2: {
        type: [String],
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    description2: {
        type: [String],
        required: false,
    },
    image: {
        type: [String],
        required: false,
    },
    soldQuantity: {
        type: Number,
        required: false,
    },
    prodCreator: {
        type: String,
        required: [true, 'UserId is Required'],
        unique: false,
        ref: 'User',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
productSchema.statics.isProductExistsByName = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.Product.findOne({ name });
    });
};
exports.Product = (0, mongoose_1.model)('Product', productSchema);
