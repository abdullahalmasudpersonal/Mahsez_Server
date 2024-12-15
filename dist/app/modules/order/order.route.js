"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post('/create-order', (0, auth_1.default)(user_constant_1.USER_ROLE.buyer, user_constant_1.USER_ROLE.admin), order_controller_1.OrderController.createOrder);
router.get('/buyer-order', (0, auth_1.default)(user_constant_1.USER_ROLE.buyer, user_constant_1.USER_ROLE.admin), order_controller_1.OrderController.getBuyerOrder);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), order_controller_1.OrderController.GetAllorder);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.buyer), order_controller_1.OrderController.GetSingleOrder);
router.patch('/update-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), order_controller_1.OrderController.updateOrderstatus);
exports.OrderRoutes = router;
