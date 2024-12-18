import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const setVisitorCookie = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.cookies.sessionId) {
    // কুকিতে Session ID সেট করা
    const sessionId = uuidv4(); // ইউনিক স্ট্রিং তৈরি
    res.cookie('sessionId', sessionId, {
      maxAge: 24 * 60 * 60 * 1000, // 1 দিন (মিলিসেকেন্ড)
      httpOnly: true, // JavaScript থেকে কুকি অ্যাক্সেস বন্ধ (security)
      secure: false, // HTTPS হলে true করুন
      sameSite: 'lax', // CSRF Protection
    });
    console.log('New Session ID created:', sessionId);
  } else {
    console.log('Existing Session ID:', req.cookies.sessionId);
  }
  next();
};
