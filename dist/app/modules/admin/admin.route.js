"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.get('/', admin_controller_1.AdminController.getAdmins);
router.patch('/update-online-status', admin_controller_1.AdminController.updateOnlineStatus);
exports.AdminRoutes = router;
