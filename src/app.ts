import cron from 'node-cron';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import { visitorMiddleware } from './app/middlewares/visitor.middleware';
import cookieParser from 'cookie-parser';
// import { setVisitorCookie } from './app/middlewares/setVisitorCookie';
import { Visitor } from './app/modules/visitors/visitors.model';
import { setVisitorCookie } from './app/middlewares/setVisitorCookie';

const app: Application = express();

const corsOptions = {
  origin: ['https://mahsez.vercel.app', 'http://localhost:5173','http://192.168.0.103:5173'],
  // methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
};


/// parsers
app.use(express.json());
app.use(cors(corsOptions));
// app.set('trust proxy', true);
app.use(cookieParser());
app.use(setVisitorCookie);

// // প্রতিদিন রাত 12টায় পুরানো Session ID মুছে ফেলা
// cron.schedule('0 0 * * *', async () => {
//   const oneDayAgo = new Date();
//   oneDayAgo.setDate(oneDayAgo.getDate() - 1);

//   await Visitor.deleteMany({ visitedAt: { $lt: oneDayAgo } });
//   console.log('Old session IDs removed successfully.');
// });

app.use('/api/v1/product', visitorMiddleware);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Mahsez Server In Progress!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
