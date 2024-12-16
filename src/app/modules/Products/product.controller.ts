import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, RequestHandler, Response } from 'express';
import { ProdcutServices } from './product.service';
import { User } from '../User/user.model';
import ip from 'ip';
import requestIp from 'request-ip';

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
  // console.log(req.socket.remoteAddress, 'req');
  // console.log(req.headers['user-agent']);
  // const ip = req.headers['x-forwarded-for'];

  const token = req.headers.authorization || '';
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));

  let ip = req.socket.remoteAddress || '';
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7); // IPV4 address
  }
  console.log(ip, 'ipp');

  let ips = requestIp.getClientIp(req);
  console.log(ips, 'ips');

  await User.updateOne({ email: payload?.email }, { ipAddress: ip });

  const result = await ProdcutServices.getProductIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Product Successfully',
    data: result,
  });
});

const getAllProductWithSearchFilter: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProdcutServices.getProductsWithSearchFilterIntoDB(
      req.query,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get All Product Successfully',
      meta: result.meta,
      data: result.result,
    });
  },
);

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProdcutServices.getSingleProductIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Product Successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProdcutServices.updateProductIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Product Successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProdcutServices.deleteProductIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete Single Product Successfully',
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProductWithSearchFilter,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
