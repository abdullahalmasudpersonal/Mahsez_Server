import { Request } from 'express';
import { generateReviewId } from './review.utils';
import { IUploadFile } from '../../interface/file';
import { FileUploadHelper } from '../../utils/fileUploadHelper';
import { Review } from './review.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createReviewIntoDB = async (req: Request) => {
  const reviewData = req.body;
  const buyer = req?.user?.buyer;
  const reviewId = await generateReviewId();

  const files = req.files as unknown;
  let uploadFiles: IUploadFile[] = [];

  if (Array.isArray(files)) {
    uploadFiles = files as IUploadFile[];
  } else if (files && typeof files === 'object') {
    uploadFiles = Object.values(files).flat() as IUploadFile[];
  }

  reviewData.buyer = buyer;
  reviewData.reviewId = reviewId;

  try {
    if (uploadFiles) {
      const uploadedProfileImage =
        await FileUploadHelper.uploadToCloudinary(uploadFiles);
      req.body.image = uploadedProfileImage.map((img) => img.secure_url);
    }
    const newReview = await Review.create([reviewData]);
    if (!newReview?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Product!');
    }
    return newReview;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getSingeProductReviewIntoDB = async (req: Request) => {
  const productId = req.params.id;
  const res = await Review.find({ productId });
  return res;
};

export const ReviewService = {
  createReviewIntoDB,
  getSingeProductReviewIntoDB,
};
