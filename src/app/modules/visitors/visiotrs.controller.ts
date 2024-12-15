import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { VisitorServices } from "./visitors.service";

const createVisiotr = catchAsync(async (req: Request, res: Response) => {
  // const { id } = req.params;

  const result = await VisitorServices.createVisiotrIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create visitor successfully!",
    data: result,
  });
});

export const VisitorController = {
  createVisiotr,
};
