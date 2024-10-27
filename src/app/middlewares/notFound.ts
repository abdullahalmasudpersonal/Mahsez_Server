import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

// const notFound = (res: Response) => {
//   return res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: 'API Not Found !!',
//     error: '',
//   });
// };

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Route not found');
};

export default notFound;
