"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const router = (0, express_1.Router)();
router.post('/create-product', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), fileUploadHelper_1.FileUploadHelper.upload.array('files', 10), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return product_controller_1.ProductController.createProduct(req, res, next);
});
router.get('/', product_controller_1.ProductController.getAllProduct);
router.get('/search-filter', product_controller_1.ProductController.getAllProductWithSearchFilter);
router.get('/:id', product_controller_1.ProductController.getSingleProduct);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), fileUploadHelper_1.FileUploadHelper.upload.array('files', 10), (req, res, next) => {
    return product_controller_1.ProductController.updateProduct(req, res, next);
});
router.delete('/:id', product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
