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
exports.ProdcutServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("./product.model");
const product_utils_1 = require("./product.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const fileUploadHelper_1 = require("../../utils/fileUploadHelper");
const product_constant_1 = require("./product.constant");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createProductIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const productData = req.body;
    const prodCreator = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const produtId = yield (0, product_utils_1.generateProductId)();
    const existingPorduct = yield product_model_1.Product.findOne({ name: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.name });
    if (existingPorduct) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Alrady exist this product!');
    }
    //////////// Upload moultile file
    const files = req.files;
    let uploadFiles = [];
    if (Array.isArray(files)) {
        uploadFiles = files;
    }
    else if (files && typeof files === 'object') {
        uploadFiles = Object.values(files).flat();
    }
    productData.productId = produtId;
    productData.prodCreator = prodCreator;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (uploadFiles) {
            const uploadedProfileImage = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(uploadFiles);
            req.body.image = uploadedProfileImage.map((img) => img.secure_url);
        }
        const newProdcut = yield product_model_1.Product.create([productData], { session });
        if (!(newProdcut === null || newProdcut === void 0 ? void 0 : newProdcut.length)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Product!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return newProdcut;
    }
    catch (err) {
        throw new Error(err);
    }
});
const getProductIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield product_model_1.Product.find().sort({ createdAt: -1 });
});
const getProductsWithSearchFilterIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productquery = new QueryBuilder_1.default(product_model_1.Product.find(), query)
        .search(product_constant_1.productSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield productquery.countTotal();
    const result = yield productquery.modelQuery;
    return {
        meta,
        result,
    };
});
const getSingleProductIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const _id = (_c = req.params) === null || _c === void 0 ? void 0 : _c.id;
    const singleProduct = yield product_model_1.Product.findById({ _id: _id });
    return singleProduct;
});
const updateProductIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const updateData = JSON.parse(req.body.data);
    let existingFiles = req.body.existingFiles || [];
    const newFiles = req.files;
    let uploadFiles = [];
    /// convert array when single existing File
    if (!Array.isArray(existingFiles)) {
        if (typeof existingFiles === 'string') {
            existingFiles = [existingFiles];
        }
        else {
            existingFiles = [];
        }
    }
    if (Array.isArray(newFiles)) {
        uploadFiles = newFiles;
    }
    else if (newFiles && typeof newFiles === 'object') {
        uploadFiles = Object.values(newFiles).flat();
    }
    if (uploadFiles.length > 0) {
        const uploadedImages = yield fileUploadHelper_1.FileUploadHelper.uploadToCloudinary(uploadFiles);
        const newImageURLs = uploadedImages.map((img) => img.secure_url);
        updateData.image = [...existingFiles, ...newImageURLs];
    }
    else {
        updateData.image = existingFiles;
    }
    return yield product_model_1.Product.findByIdAndUpdate({ _id: productId }, { $set: updateData });
});
const deleteProductIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const productId = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id;
    const result = yield product_model_1.Product.deleteOne({ _id: productId });
    return result;
});
exports.ProdcutServices = {
    createProductIntoDB,
    getProductsWithSearchFilterIntoDB,
    getProductIntoDB,
    getSingleProductIntoDB,
    updateProductIntoDB,
    deleteProductIntoDB,
};
