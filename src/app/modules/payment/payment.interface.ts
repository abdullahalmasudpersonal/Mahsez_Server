import { Model } from 'mongoose';

export type TPayment = {
  orderId: string;
  amount: number;
  transactionId: string;
  paymentStatus: 'UNPAID' | 'PAID';
  orderStatus: 'Pneding' | 'Fake' | 'Confirm' | 'Canceled' | 'Delivered';
  paymentType: 'Cash On Delivery' | 'Online Payment' | 'Mobile Banking';
  paymentNumber?: string;
  paymentGetwayData?: JSON;
  isDeleted: boolean;
};

export interface PaymentModel extends Model<TPayment> {}
