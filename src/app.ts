import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';

const app: Application = express();

const corsOptions = {
  origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
  credentials: true,
};

// const allowedOrigins = ['https://mahsez.vercel.app', 'http://localhost:5173'];

// const corsOptions = {
//   origin: (origin, callback) => {
//     // যদি origin নির্দিষ্ট তালিকায় থাকে বা না থাকে (e.g., কোনো অ্যাপ্লিকেশন থেকে সরাসরি),
//     // তাহলে অ্যাক্সেস অনুমতি দেওয়া হবে
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

/// parsers
app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Mahsez Server In Progress!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
