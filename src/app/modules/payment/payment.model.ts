import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID'],
      required: true,
      default: 'UNPAID',
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['Pneding', 'Fake', 'Confirm', 'Canceled', 'Delivered'],
      },
      required: true,
      default: 'Pneding',
    },
    paymentType: {
      type: String,
      enum: {
        values: ['Cash On Delivery', 'Online Payment', 'Mobile Banking'],
      },
      required: true,
    },
    paymentNumber: {
      type: String,
      required: false,
    },
    paymentGetwayData: {
      type: JSON,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<TPayment>('Payment', paymentSchema);
