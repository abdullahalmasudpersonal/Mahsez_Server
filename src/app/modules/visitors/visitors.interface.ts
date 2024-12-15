import { Model } from "mongoose";

export interface TVisitors {
  count: number;
}

export interface VisitorModel extends Model<TVisitors> {}
