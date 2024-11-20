import { model, Schema } from 'mongoose';
import { TOrder, TOrderItem } from './order.interface';

const OrderItemSchema = new Schema<TOrderItem>({
  product_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema<TOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
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
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID'],
      required: true,
      default: 'UNPAID',
    },
    paymentNumber: {
      type: String,
      required: false,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    confirmOrder: {
      type: Boolean,
      default: false,
    },
    confirmOrderDate: {
      type: Date,
      required: false,
    },
    deliveredOrder: {
      type: Boolean,
      default: false,
    },
    deliveredOrderDate: {
      type: Date,
      required: false,
    },
    cancelOrder: {
      type: Boolean,
      default: false,
    },
    cancelOrderDate: {
      type: Date,
      required: false,
    },
    fakeOrder: {
      type: Boolean,
      default: false,
    },
    fakeOrderDate: {
      type: Date,
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

export const Order = model<TOrder>('Order', orderSchema);
