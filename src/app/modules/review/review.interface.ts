export type TReview = {
  reviewId: string; // unique ID for review
  productId: string; // কোন প্রোডাক্টে রিভিউ দেওয়া হয়েছে
  userId: string; // ইউজার আইডি (যিনি রিভিউ দিয়েছেন)
  displayName: string; // ইউজারের নাম (ডিসপ্লের জন্য)
  rating: number; // 1 থেকে 5 পর্যন্ত সংখ্যা
  comment?: string; // ঐচ্ছিক মন্তব্য
  images?: string[]; // ইউজার যদি ছবি যোগ করে (optional)
  isVerifiedBuyer: boolean; // প্রোডাক্ট কেনা হয়েছিল কিনা
  helpfulVotes: number; // কতজন ইউজারের কাছে এটি helpful লেগেছে
  unhelpfulVotes: number; // কতজন unhelpful বলেছে
  createdAt: string; // রিভিউ কবে পোস্ট হয়েছে
  updatedAt?: string; // কখন আপডেট হয়েছে (optional)
};
