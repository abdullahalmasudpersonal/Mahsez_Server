import { model, Schema } from 'mongoose';
import {
  TVisitors,
  visitorDeviceInfo,
  visitorIspInfo,
} from './visitors.interface';

const visitorDeviceInfoSchema = new Schema<visitorDeviceInfo>({
  device: { type: String, required: false },
  brand: { type: String, required: false },
  type: { type: String, required: false },
  os: { type: String, required: false },
  cpu: { type: String, required: false },
  osVersion: { type: String, required: false },
  browser: { type: String, required: false },
  browserVersion: { type: String, required: false },
});

const visitorIspInfoSchema = new Schema<visitorIspInfo>({
  country: { type: String, required: false },
  region: { type: String, required: false },
  regionName: { type: String, required: false },
  city: { type: String, required: false },
  isp: { type: String, required: false },
  org: { type: String, required: false },
  as: { type: String, required: false },
  lat: { type: Number, required: false },
  lon: { type: Number, required: false },
  timezone: { type: String, required: false },
});

const visitorSchema = new Schema<TVisitors>({
  ip: {
    type: String,
    required: false,
  },
  sessionId: { type: String, required: false },
  visitCount: { type: Number, default: 1 },
  deviceInfo: visitorDeviceInfoSchema,
  ispInfo: visitorIspInfoSchema,
  visitedAt: { type: Date, default: Date.now },
  lastVisitedAt: { type: Date, required: false },
});

export const Visitor = model<TVisitors>('Visitor', visitorSchema);
