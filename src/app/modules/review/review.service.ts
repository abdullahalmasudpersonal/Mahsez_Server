import { Request } from "express";

const createReviewIntoDB = async(req:Request) => {
    const reviewData = req.body;
    const reviewCreator = req?.user?.email;
    console.log(reviewCreator)
}


export const ReviewService = {
    createReviewIntoDB
}