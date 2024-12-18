import { Request } from 'express';
import { Visitor } from './visitors.model';

const getVisiotrIntoDB = async (req: Request) => {
  console.log(req, 'req');
};

export const VisitorServices = {
  getVisiotrIntoDB,
};
