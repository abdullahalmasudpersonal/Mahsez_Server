"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const router = (0, express_1.Router)();
router.post('/create-buyer', user_controller_1.UserController.createBuyer);
router.post('/create-admin', user_controller_1.UserController.createAdmin);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.buyer), user_controller_1.UserController.getMe);
router.patch('/update-my-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.buyer), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    return user_controller_1.UserController.updateMyProfile(req, res, next);
});
exports.UserRoutes = router;
