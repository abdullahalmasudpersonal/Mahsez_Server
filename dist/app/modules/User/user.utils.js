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
exports.generateAdminId = exports.generatebuyerId = void 0;
const user_model_1 = require("./user.model");
/////////////////////// buyer id generate /////////////////////////
const findLastBuyerId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastStudent = yield user_model_1.User.findOne({
        role: 'buyer',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.id) ? lastStudent.id : undefined;
});
const generatebuyerId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastBuyerId = yield findLastBuyerId();
    const lastIdNumber = lastBuyerId ? parseInt(lastBuyerId.slice(-6)) : 0;
    const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const buyerId = `B-${month}${year}${incrementId}`;
    return buyerId;
});
exports.generatebuyerId = generatebuyerId;
/////////admin id genarate //////////////////////////
const findLastAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdmin = yield user_model_1.User.findOne({
        role: 'admin',
    }, {
        id: 1,
        _id: 0,
    })
        .sort({
        createdAt: -1,
    })
        .lean();
    return (lastAdmin === null || lastAdmin === void 0 ? void 0 : lastAdmin.id) ? lastAdmin.id : undefined;
});
const generateAdminId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastAdminId = yield findLastAdminId();
    // আগের আইডি থেকে শেষের ছয় সংখ্যার অংশ নিয়ে তাতে ১ যোগ করা
    const lastIdNumber = lastAdminId ? parseInt(lastAdminId.slice(-6)) : 0;
    const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');
    // মাস এবং বছরের তথ্য সংগ্রহ
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    // এডমিন আইডি তৈরি
    const adminId = `A-${month}${year}${incrementId}`;
    return adminId;
});
exports.generateAdminId = generateAdminId;
