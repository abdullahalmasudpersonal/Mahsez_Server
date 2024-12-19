import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const setVisitorCookie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.cookies.sessionId) {
      const sessionId = uuidv4();
      res.cookie('sessionId', sessionId, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'none',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};
