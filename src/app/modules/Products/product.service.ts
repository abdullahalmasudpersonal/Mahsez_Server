import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from './product.model';
import { generateProductId } from './product.utils';
import mongoose from 'mongoose';
import { Request } from 'express';
import { IUploadFile } from '../../interface/file';
import { FileUploadHelper } from '../../utils/fileUploadHelper';
import { productSearchableFields } from './product.constant';
import QueryBuilder from '../../builder/QueryBuilder';

const createProductIntoDB = async (req: Request) => {
  const productData = req.body;
  const prodCreator = req.user?.email;
  const produtId = await generateProductId();

  const existingPorduct = await Product.findOne({ name: req?.body?.name });

  if (existingPorduct) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Alrady exist this product!');
  }

  //////////// Upload moultile file
  const files = req.files as unknown;
  let uploadFiles: IUploadFile[] = [];

  if (Array.isArray(files)) {
    uploadFiles = files as IUploadFile[];
  } else if (files && typeof files === 'object') {
    uploadFiles = Object.values(files).flat() as IUploadFile[];
  }

  productData.productId = produtId;
  productData.prodCreator = prodCreator;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (uploadFiles) {
      const uploadedProfileImage =
        await FileUploadHelper.uploadToCloudinary(uploadFiles);
      req.body.image = uploadedProfileImage.map((img) => img.secure_url);
    }
    const newProdcut = await Product.create([productData], { session });
    if (!newProdcut?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Product!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newProdcut;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getProductIntoDB = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

const getProductsWithSearchFilterIntoDB = async (
  query: Record<string, unknown>,
) => {
  const productquery = new QueryBuilder(Product.find(), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productquery.countTotal();
  const result = await productquery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleProductIntoDB = async (req: Request) => {
  const _id = req.params?.id;
  const singleProduct = await Product.findById({ _id: _id });
  return singleProduct;
};

const updateProductIntoDB = async (req: Request) => {
  const productId = req.params.id;
  const updateData = JSON.parse(req.body.data);
  let existingFiles = req.body.existingFiles || [];
  const newFiles = req.files as unknown;
  let uploadFiles: IUploadFile[] = [];

  /// convert array when single existing File
  if (!Array.isArray(existingFiles)) {
    if (typeof existingFiles === 'string') {
      existingFiles = [existingFiles];
    } else {
      existingFiles = [];
    }
  }

  if (Array.isArray(newFiles)) {
    uploadFiles = newFiles as IUploadFile[];
  } else if (newFiles && typeof newFiles === 'object') {
    uploadFiles = Object.values(newFiles).flat() as IUploadFile[];
  }

  if (uploadFiles.length > 0) {
    const uploadedImages =
      await FileUploadHelper.uploadToCloudinary(uploadFiles);
    const newImageURLs = uploadedImages.map((img) => img.secure_url);

    updateData.image = [...existingFiles, ...newImageURLs];
  } else {
    updateData.image = existingFiles;
  }

  return await Product.findByIdAndUpdate(
    { _id: productId },
    { $set: updateData },
  );
};

const deleteProductIntoDB = async (req: Request) => {
  const productId = req?.params?.id;
  const result = await Product.deleteOne({ _id: productId });
  return result;
};

export const ProdcutServices = {
  createProductIntoDB,
  getProductsWithSearchFilterIntoDB,
  getProductIntoDB,
  getSingleProductIntoDB,
  updateProductIntoDB,
  deleteProductIntoDB,
};
