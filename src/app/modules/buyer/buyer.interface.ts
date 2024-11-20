import { Types } from 'mongoose';

export type TBuyer = {
  id: string;
  user: Types.ObjectId;
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  contactNo: string;
  companyName: string;
  city: string;
  postCode: string;
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  isDeleted: boolean;
  createdAt?: string;
};
