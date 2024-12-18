"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorRoutes = void 0;
const express_1 = require("express");
const visiotrs_controller_1 = require("./visiotrs.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), visiotrs_controller_1.VisitorController.getVisiotr);
exports.visitorRoutes = router;
