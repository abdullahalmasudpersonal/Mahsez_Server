import { User } from './user.model';

const findLastBuyerId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'buyer',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generatebuyerId = async () => {
  const lastBuyerId = await findLastBuyerId();

  const lastIdNumber = lastBuyerId ? parseInt(lastBuyerId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  const buyerId = `B-${month}${year}${incrementId}`;
  return buyerId;
};

/////////admin
const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminId = async () => {
  const lastAdminId = await findLastAdminId();

  // আগের আইডি থেকে শেষের ছয় সংখ্যার অংশ নিয়ে তাতে ১ যোগ করা
  const lastIdNumber = lastAdminId ? parseInt(lastAdminId.slice(-6)) : 0;
  const incrementId = (lastIdNumber + 1).toString().padStart(6, '0');

  // মাস এবং বছরের তথ্য সংগ্রহ
  const date = new Date();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);

  // এডমিন আইডি তৈরি
  const adminId = `A-${month}${year}${incrementId}`;
  return adminId;
};
