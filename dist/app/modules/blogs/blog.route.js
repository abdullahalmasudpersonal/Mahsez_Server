"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const router = (0, express_1.Router)();
router.post('/create-blog', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return blog_controller_1.BlogController.createBlog(req, res, next);
});
router.get('/', blog_controller_1.BlogController.getBlogs);
router.get('/:id', blog_controller_1.BlogController.getSingleBlog);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), fileUploadHelper_1.FileUploadHelper.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return blog_controller_1.BlogController.updateSingleBlog(req, res, next);
});
router.delete('/:id', blog_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
