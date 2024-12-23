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
exports.AdminServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const admin_model_1 = require("./admin.model");
const user_model_1 = require("../User/user.model");
const getAdminsIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield admin_model_1.Admin.find();
        const adminEmails = admins.map((admin) => admin.email);
        const users = yield user_model_1.User.find({ email: { $in: adminEmails } });
        const mergedData = admins.map((admin) => {
            const user = users.find((user) => user.email === admin.email);
            return Object.assign(Object.assign({}, admin.toObject()), user === null || user === void 0 ? void 0 : user.toObject());
        });
        return mergedData;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get admin data!');
    }
});
const updateOnlineStatusIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    return yield admin_model_1.Admin.updateOne({ id: user === null || user === void 0 ? void 0 : user.userId }, { $set: { onlineStatus: 'offline' } });
});
exports.AdminServices = {
    getAdminsIntoDB,
    updateOnlineStatusIntoDB,
};
