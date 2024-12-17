import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';
import requestIp from 'request-ip';
import { Visitor } from './app/modules/visitors/visitors.model';
import axios from 'axios';
import { TVisitors } from './app/modules/visitors/visitors.interface';
import { UAParser } from 'ua-parser-js';

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

app.use('/api/v1/product', async (req, res, next) => {
  try {
    const ip = requestIp.getClientIp(req);
    const ips = '103.120.203.217';
    const geoApiUrl = `http://ip-api.com/json/${ip}`;
    const geoResponse = await axios.get(geoApiUrl);
    const geoData = geoResponse.data;

    const uaParser = new UAParser();
    const userAgentString = req.headers['user-agent'] || '';
    const parsedUA = uaParser.setUA(userAgentString).getResult();

    // const currentData = new Date();
    // const formattedDate1 = currentData.toString().split('T')[0];
    // console.log(formattedDate1, 'todate');
    // if(ip){
    //   const visitor = await Visitor.find({ ip, visitedAt:''})
    // }
    // const ips = '103.120.203.217';

    const visitorData = {
      ip: ip,
      deviceInfo: {
        device: parsedUA.device.model || 'Unknown',
        brand: parsedUA.device.vendor || 'Unknown',
        type: parsedUA.device.type || 'Unknown',
        os: parsedUA.os.name,
        cpu: parsedUA.cpu.architecture,
        osVersion: parsedUA.os.version,
        browser: parsedUA.browser.name,
        browserVersion: parsedUA.browser.version,
      },
      ispInfo: {
        country: geoData.country,
        region: geoData.region,
        regionName: geoData.regionName,
        city: geoData.city,
        isp: geoData.isp,
        org: geoData.org,
        as: geoData.as,
        lat: geoData.lat,
        lon: geoData.lon,
        timezone: geoData.timezone,
      },
    };
    // console.log(visitorData /* req.headers['user-agent'] */, 'visiotrdAta');

    const newVisitor = await Visitor.create(visitorData);
    console.log(newVisitor, 'new visitor');

    // const userAgent = req.headers['user-agent']?.toLowerCase();
    // console.log(userAgent, 'useragent');
    // let deviceType = 'Desktop';
    // if (userAgent?.includes('mobile')) {
    //   deviceType = 'Mobile';
    // } else if (userAgent?.includes('tablet') || userAgent?.includes('ipad')) {
    //   deviceType = 'Tablet';
    // }
    // console.log(`Visitor is using a ${deviceType} device.`);

    // const response = await fetch('https://api.ipify.org?format=json');
    // const data = await response.json();
    // console.log(`Your Public IP: ${data.ip}`);

    // const data = {
    //   device: parsedUA.device.model || 'Unknown',
    //   brand: parsedUA.device.vendor || 'Unknown',
    //   type: parsedUA.device.type || 'Unknown',
    //   os: parsedUA.os.name,
    //   osVersion: parsedUA.os.version,
    //   browser: parsedUA.browser.name,
    //   browserVersion: parsedUA.browser.version,
    // };
    // console.log(data);

    // console.log('Full User Agent Info:', parsedUA);
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
