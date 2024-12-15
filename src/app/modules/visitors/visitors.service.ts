import { Request } from "express";
import { Visitor } from "./visitors.model";

const createVisiotrIntoDB = async (req: Request) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }
    await visitor.save();
  } catch (err) {
    console.log(err);
  }
};

export const VisitorServices = {
  createVisiotrIntoDB,
};
