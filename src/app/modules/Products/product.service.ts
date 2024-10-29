import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import { generateProductId } from './product.utils';
import mongoose from 'mongoose';
import { Request } from 'express';

const createProductIntoDB = async (req: Request) => {
  const productData = req.body;
  const prodCreator = req.user?.email;
  const produtId = await generateProductId();

  productData.id = produtId;
  productData.prodCreator = prodCreator;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

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
  const allProduct = await Product.find();
  return allProduct;
};

export const ProdcutServices = {
  createProductIntoDB,
  getProductIntoDB,
};
