import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { generateProductId } from './product.utils';
import mongoose from 'mongoose';
import { Request } from 'express';
import { IUploadFile } from '../../interface/file';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

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
  const allProduct = await Product.find().sort({ createdAt: -1 });
  return allProduct;
};

const getSingleProductIntoDB = async (req: Request) => {
  const _id = req.params?.id;

  const singleProduct = await Product.findById({ _id: _id });
  return singleProduct;
};

const deleteProductIntoDB = async (req: Request) => {
  const productId = req?.params?.id;
  const result = await Product.deleteOne({ _id: productId });
  return result;
};

export const ProdcutServices = {
  createProductIntoDB,
  getProductIntoDB,
  getSingleProductIntoDB,
  deleteProductIntoDB,
};
