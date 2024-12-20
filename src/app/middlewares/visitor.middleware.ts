import requestIp from 'request-ip';
import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import { NextFunction, Request, Response } from 'express';
import { Visitor } from '../modules/visitors/visitors.model';

export const visitorMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies.sessionId;
    const ip = requestIp.getClientIp(req);
    const geoApiUrl = `http://ip-api.com/json/${ip}`;
    const geoResponse = await axios.get(geoApiUrl);
    const geoData = geoResponse.data;

    const uaParser = new UAParser();
    const userAgentString = req.headers['user-agent'] || '';
    const parsedUA = uaParser.setUA(userAgentString).getResult();

    const visitorData = {
      ip: ip,
      sessionId: sessionId,
      lastVisitedAt: new Date(),
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

    if (sessionId) {
      const existingVisitor = await Visitor.findOne({ sessionId });
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      if (existingVisitor) {
        if (existingVisitor.lastVisitedAt < fifteenMinutesAgo) {
          existingVisitor.visitCount += 1;
          existingVisitor.lastVisitedAt = new Date();
          await existingVisitor.save();
        }
      } else {
        await Visitor.create(visitorData);
      }
    }
    next();
  } catch (error) {
    // const response = await fetch('https://api.ipify.org?format=json');
    next(error);
  }
};

// const currentDate = new Date();
// const formattedDate = currentDate.toLocaleDateString('sv-SE');
// const startOfDay = new Date(formattedDate);
// const endOfDay = new Date(formattedDate);
// endOfDay.setUTCHours(23, 59, 59, 999);

// const existingVisitor = await Visitor.findOne({
//   ip: ip,
//   visitedAt: {
//     $gte: startOfDay,
//     $lt: endOfDay,
//   },
// });
