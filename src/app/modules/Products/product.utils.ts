import { Product } from './product.model';

// সর্বশেষ প্রডাক্ট আইডি খুঁজে বের করার জন্য একটি ফাংশন
const findLastProductId = async () => {
  const lastProduct = await Product.findOne(
    {},
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastProduct?.id ? lastProduct.id : undefined;
};

// নতুন প্রডাক্ট আইডি তৈরির জন্য ফাংশন
export const generateProductId = async () => {
  const lastProductId = await findLastProductId();

  // আগের আইডি থেকে শেষের ছয় সংখ্যার অংশ নিয়ে তাতে ১ যোগ করা
  const lastIdNumber = lastProductId ? parseInt(lastProductId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  // প্রডাক্ট আইডি তৈরি
  const productId = `POM${incrementId}`;
  return productId;
};
