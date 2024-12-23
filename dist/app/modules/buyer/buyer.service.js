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
exports.BuyerServices = void 0;
const buyer_model_1 = require("./buyer.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../User/user.model");
const getBuyersIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield buyer_model_1.Buyer.find()
        .select('_id id name email user gender contactNo companyName city postCode  presentAddress permanentAddress profileImg createdAt onlineStatus')
        .populate('user', 'role status isOnline onlineStatus');
});
const deleteBuyerIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const buyerId = req.params.id;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const deleteBuyerFormBuyer = yield buyer_model_1.Buyer.findOneAndDelete({ _id: buyerId });
        const deleteUser = yield user_model_1.User.deleteOne({
            _id: deleteBuyerFormBuyer === null || deleteBuyerFormBuyer === void 0 ? void 0 : deleteBuyerFormBuyer.user,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return deleteUser;
    }
    catch (err) {
        throw new Error(err);
    }
});
const updateOnlineStatusIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    return yield buyer_model_1.Buyer.updateOne({ id: user === null || user === void 0 ? void 0 : user.userId }, { $set: { onlineStatus: 'offline' } });
});
exports.BuyerServices = {
    getBuyersIntoDB,
    deleteBuyerIntoDB,
    updateOnlineStatusIntoDB,
};
