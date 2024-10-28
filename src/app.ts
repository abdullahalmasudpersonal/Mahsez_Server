import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';

const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:5173', // আপনার React অ্যাপের URL
  credentials: true, // আপনাকে ক্রেডেনশিয়াল অনুমতি দিতে হবে
};

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
