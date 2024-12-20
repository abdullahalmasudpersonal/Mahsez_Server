import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { VisitorServices } from './visitors.service';

const getVisiotr = catchAsync(async (req: Request, res: Response) => {
  const result = await VisitorServices.getVisiotrIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get visitors successfully!',
    data: result,
  });
});

const getVisiotrWithFilter = catchAsync(async (req: Request, res: Response) => {
  const result = await VisitorServices.getVisitorsWithFilterWithSearchIntoDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get filter visitors successfully!',
    meta: result.meta,
    data: result.result,
  });
});

export const VisitorController = {
  getVisiotr,
  getVisiotrWithFilter,
};
