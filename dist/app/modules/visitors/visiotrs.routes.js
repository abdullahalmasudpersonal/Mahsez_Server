"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitorRoutes = void 0;
const express_1 = require("express");
const visiotrs_controller_1 = require("./visiotrs.controller");
const router = (0, express_1.Router)();
router.post("/", visiotrs_controller_1.VisitorController.createVisiotr);
exports.visitorRoutes = router;
