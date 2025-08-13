import { Types } from "mongoose";

export type TReview = {
  reviewId: string;
  productId: string; 
  buyer: Types.ObjectId;
  displayName: string;
  rating: number;
  comment?: string; 
  images?: string[]; 
  isVerifiedBuyer: boolean;
  helpfulVotes: number; 
  unhelpfulVotes: number; 
  createdAt: string; 
  updatedAt?: string; 
}
