import { Model } from 'mongoose';

export interface TVisitors {
  ip: string;
  userAgent: string;
  visitedAt: Date;
  country: string;
  region: string;
  regionName: string;
  city: string;
  isp: string;
  org: string;
  as: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface VisitorModel extends Model<TVisitors> {}
