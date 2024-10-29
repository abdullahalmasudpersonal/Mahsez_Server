import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { ProdcutServices } from './product.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProdcutServices.createProductIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Created Successfully',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProdcutServices.getProductIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Product Successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
};
