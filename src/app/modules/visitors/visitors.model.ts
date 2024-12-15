import { model, Schema } from "mongoose";
import { TVisitors } from "./visitors.interface";

const visitorSchema = new Schema<TVisitors>({
  count: {
    type: Number,
    required: true,
  },
});

export const Visitor = model<TVisitors>("Visitor", visitorSchema);
