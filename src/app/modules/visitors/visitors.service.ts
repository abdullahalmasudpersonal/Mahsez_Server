import { Request } from 'express';
import { Visitor } from './visitors.model';

const createVisiotrIntoDB = async (req: Request) => {
  console.log(req, 'req');
};

export const VisitorServices = {
  createVisiotrIntoDB,
};
