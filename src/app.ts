import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import requestIp from 'request-ip';
import { Visitor } from './app/modules/visitors/visitors.model';
import axios from 'axios';

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

app.use('/api/v1', async (req, res, next) => {
  if (req.path === '/') {
    return next(); // ফেভিকন রিকোয়েস্ট স্কিপ করুন
  }
  console.log(`Middleware triggered for path: ${req.path}`);
  try {
    const ip = requestIp.getClientIp(req);
    // const currentData = new Date();
    // const formattedDate1 = currentData.toString().split('T')[0];
    // console.log(formattedDate1, 'todate');
    // if(ip){
    //   const visitor = await Visitor.find({ ip, visitedAt:''})
    // }
    const geoApiUrl = `http://ip-api.com/json/${ip}`;
    const geoResponse = await axios.get(geoApiUrl);
    const geoData = geoResponse.data;
    console.log(geoData, 'gio data');

    const userAgent = req.headers['user-agent'];
    const visitorData = {
      ip: ip,
      gioData: geoData,
      userAgent: userAgent,
    };
    // console.log(visitorData, 'visiotrdAta');

    const newVisitor = await Visitor.create(visitorData);
    // console.log(newVisitor, 'new visitor');
  } catch (error) {
    console.error('Error counting visitor:', error);
  }
  next();
});

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Mahsez Server In Progress!');
});

app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
