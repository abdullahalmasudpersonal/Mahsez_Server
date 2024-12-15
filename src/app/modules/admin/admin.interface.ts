import { Types } from 'mongoose';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  contactNo: string;
  companyName: string;
  city: string;
  postCode: string;
  onlineStatus: 'online' | 'offline';
  presentAddress: string;
  permanentAddress: string;
  profileImg?: string;
  isDeleted: boolean;
};
