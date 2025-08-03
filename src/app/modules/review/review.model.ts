import { model, Schema } from 'mongoose';
import { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
    },
    productId: {
      type: String,
      required: true,
      ref: 'Product',
    },
    buyer: {
      type:Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      ref: 'Buyer',
    },
    displayName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    images: {
      type: [String],
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    unhelpfulVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Review = model<TReview>('Review', reviewSchema);
