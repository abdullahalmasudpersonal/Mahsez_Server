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
exports.generateProductId = void 0;
const product_model_1 = require("./product.model");
// সর্বশেষ প্রডাক্ট আইডি খুঁজে বের করার জন্য একটি ফাংশন
const findLastProductId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastProduct = yield product_model_1.Product.findOne({}, {
        productId: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastProduct === null || lastProduct === void 0 ? void 0 : lastProduct.productId) ? lastProduct.productId : undefined;
});
// নতুন প্রডাক্ট আইডি তৈরির জন্য ফাংশন
const generateProductId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastProductId = yield findLastProductId();
    // আগের আইডি থেকে শেষের ছয় সংখ্যার অংশ নিয়ে তাতে ১ যোগ করা
    const lastIdNumber = lastProductId ? parseInt(lastProductId.slice(-6)) : 0;
    const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');
    // প্রডাক্ট আইডি তৈরি
    const productId = `POM${incrementId}`;
    return productId;
});
exports.generateProductId = generateProductId;
