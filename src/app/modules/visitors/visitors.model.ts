import { model, Schema } from 'mongoose';
import { TVisitors } from './visitors.interface';

const visitorSchema = new Schema<TVisitors>({
  ip: {
    type: String,
    required: true,
  },
  userAgent: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now },
});

export const Visitor = model<TVisitors>('Visitor', visitorSchema);
