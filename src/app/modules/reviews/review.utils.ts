import { Review } from "./review.model";


// সর্বশেষ reviewId খুঁজে বের করার ফাংশন
const findLastReviewId = async () => {
  const lastReview = await Review.findOne(
    {},
    { reviewId: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastReview?.reviewId ? lastReview.reviewId : undefined;
};

// নতুন reviewId তৈরির ফাংশন
export const generateReviewId = async () => {
  const lastReviewId = await findLastReviewId();

  const lastIdNumber = lastReviewId ? parseInt(lastReviewId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  const reviewId = `REV${incrementId}`;
  return reviewId;
};
