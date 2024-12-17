"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
const request_ip_1 = __importDefault(require("request-ip"));
const visitors_model_1 = require("./app/modules/visitors/visitors.model");
const axios_1 = __importDefault(require("axios"));
const ua_parser_js_1 = require("ua-parser-js");
const app = (0, express_1.default)();
const corsOptions = {
    origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
    // methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
};
/// parsers
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.set('trust proxy', true);
app.use('/api/v1/product', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.path === '/') {
    //   return next(); // ফেভিকন রিকোয়েস্ট স্কিপ করুন
    // }
    // console.log(`Middleware triggered for path: ${req.path}`);
    try {
        const ip = request_ip_1.default.getClientIp(req);
        const ips = '103.120.203.217';
        const geoApiUrl = `http://ip-api.com/json/${ip}`;
        const geoResponse = yield axios_1.default.get(geoApiUrl);
        const geoData = geoResponse.data;
        const uaParser = new ua_parser_js_1.UAParser();
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
        const newVisitor = yield visitors_model_1.Visitor.create(visitorData);
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
    }
    catch (error) {
        console.error('Error counting visitor:', error);
    }
    next();
}));
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Mahsez Server In Progress!');
});
app.use(globalErrorhandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
