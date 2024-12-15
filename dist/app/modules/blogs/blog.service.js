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
exports.BlogServices = void 0;
const blog_modal_1 = require("./blog.modal");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const blogData = req.body;
    const existsBlog = yield blog_modal_1.Blog.findOne({ title: blogData.title });
    if (existsBlog) {
        throw new AppError_1.default(409, 'User Alrady Exists!');
    }
    const file = req.file;
    blogData.image = file === null || file === void 0 ? void 0 : file.path;
    blogData.writer = user.email;
    const createBlog = yield blog_modal_1.Blog.create(blogData);
    return createBlog;
});
const getBlogsIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_modal_1.Blog.aggregate([
        {
            $lookup: {
                from: 'admins',
                localField: 'writer',
                foreignField: 'email',
                as: 'writerInfo',
            },
        },
        {
            $unwind: {
                path: '$writerInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                description2: 1,
                features2: 1,
                image: 1,
                isDeleted: 1,
                createdAt: 1,
                updatedAt: 1,
                writer: {
                    $ifNull: ['$writerInfo.name', '$writer'],
                },
            },
        },
    ]);
    return blogs;
});
const getSingleBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    return yield blog_modal_1.Blog.findById({ _id: blogId });
});
const updateSingleBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const updateData = req.body;
    const file = req.file;
    updateData.image = file === null || file === void 0 ? void 0 : file.path;
    return yield blog_modal_1.Blog.findByIdAndUpdate({ _id: blogId }, { $set: updateData });
});
const deleteBlogIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    return yield blog_modal_1.Blog.deleteOne({ _id: blogId });
});
exports.BlogServices = {
    createBlogIntoDB,
    getBlogsIntoDB,
    getSingleBlogIntoDB,
    updateSingleBlogIntoDB,
    deleteBlogIntoDB,
};
