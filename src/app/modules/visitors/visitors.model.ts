import { model, Schema } from 'mongoose';
import { TVisitors } from './visitors.interface';

const visitorSchema = new Schema<TVisitors>({
  ip: {
    type: String,
    required: true,
  },
  userAgent: { type: String, required: false },
  visitedAt: { type: Date, default: Date.now },
  country: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  regionName: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  isp: {
    type: String,
    required: false,
  },
  org: {
    type: String,
    required: false,
  },
  as: {
    type: String,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lon: {
    type: Number,
    required: false,
  },
  timezone: {
    type: String,
    required: false,
  },
});

export const Visitor = model<TVisitors>('Visitor', visitorSchema);
