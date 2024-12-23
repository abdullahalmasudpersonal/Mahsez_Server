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
exports.UserServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const buyer_model_1 = require("../buyer/buyer.model");
const admin_model_1 = require("../admin/admin.model");
const user_constant_1 = require("./user.constant");
const createBuyerIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existsUser = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (existsUser) {
        throw new AppError_1.default(409, 'User Alrady Exists!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userData = {};
        userData.id = yield (0, user_utils_1.generatebuyerId)();
        userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
        userData.password = password;
        userData.role = 'buyer';
        const createNewUser = yield user_model_1.User.create([userData], { session });
        if (!(createNewUser === null || createNewUser === void 0 ? void 0 : createNewUser.length)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        payload.id = createNewUser[0].id;
        payload.user = createNewUser[0]._id;
        const createNewBuyer = yield buyer_model_1.Buyer.create([payload], { session });
        if (!createNewBuyer.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create buyer');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createNewBuyer;
    }
    catch (err) {
        throw new Error(err);
    }
});
const createAdminIntoDB = (password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existsUser = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (existsUser) {
        throw new AppError_1.default(409, 'User Alrady Exists!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userData = {};
        userData.id = yield (0, user_utils_1.generateAdminId)();
        userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
        userData.password = password;
        userData.role = 'admin';
        const createNewUser = yield user_model_1.User.create([userData], { session });
        if (!(createNewUser === null || createNewUser === void 0 ? void 0 : createNewUser.length)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        payload.id = createNewUser[0].id;
        payload.user = createNewUser[0]._id;
        const createNewAdmin = yield admin_model_1.Admin.create([payload], { session });
        if (!createNewAdmin.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create admin');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createNewAdmin;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getMeIntoDB = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'buyer') {
        result = yield buyer_model_1.Buyer.findOne({ id: userId }).populate('user');
    }
    if (role === 'admin') {
        result = yield admin_model_1.Admin.findOne({ id: userId }).populate('user');
    }
    if (role === 'superAdmin') {
        result = yield admin_model_1.Admin.findOne({ id: userId }).populate('user');
    }
    return result;
});
const updateMyProfileIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const userData = yield user_model_1.User.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exists!');
    }
    const file = req.file;
    req.body.profileImg = file === null || file === void 0 ? void 0 : file.path;
    let profileData;
    if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.superAdmin) {
        profileData = yield admin_model_1.Admin.findOneAndUpdate({ email: userData === null || userData === void 0 ? void 0 : userData.email }, { $set: req.body });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.admin) {
        profileData = yield admin_model_1.Admin.findOneAndUpdate({ email: userData === null || userData === void 0 ? void 0 : userData.email }, { $set: req.body });
    }
    else if ((userData === null || userData === void 0 ? void 0 : userData.role) === user_constant_1.USER_ROLE.buyer) {
        profileData = yield buyer_model_1.Buyer.findOneAndUpdate({ email: userData === null || userData === void 0 ? void 0 : userData.email }, { $set: req.body });
    }
    return profileData;
});
exports.UserServices = {
    createBuyerIntoDB,
    createAdminIntoDB,
    getMeIntoDB,
    updateMyProfileIntoDB,
};
