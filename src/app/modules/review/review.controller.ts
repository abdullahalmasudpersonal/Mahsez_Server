import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ReviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReviewIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review Created Successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
};
