import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';

const app: Application = express();

const corsOptions = {
  origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
  // methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
};

/// parsers
app.use(express.json());
app.use(cors(corsOptions));
app.set('trust proxy', true);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Mahsez Server In Progress!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
