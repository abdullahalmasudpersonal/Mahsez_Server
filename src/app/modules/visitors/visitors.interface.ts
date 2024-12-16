import { Model } from 'mongoose';

export interface TVisitors {
  ip: string;
  userAgent: string;
  visitedAt: Date;
}

export interface VisitorModel extends Model<TVisitors> {}
