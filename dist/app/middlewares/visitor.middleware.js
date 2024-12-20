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
exports.visitorMiddleware = void 0;
const request_ip_1 = __importDefault(require("request-ip"));
const axios_1 = __importDefault(require("axios"));
const ua_parser_js_1 = require("ua-parser-js");
const visitors_model_1 = require("../modules/visitors/visitors.model");
const visitorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.cookies.sessionId;
        const ip = request_ip_1.default.getClientIp(req);
        const geoApiUrl = `http://ip-api.com/json/${ip}`;
        const geoResponse = yield axios_1.default.get(geoApiUrl);
        const geoData = geoResponse.data;
        const uaParser = new ua_parser_js_1.UAParser();
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
            const existingVisitor = yield visitors_model_1.Visitor.findOne({ sessionId });
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
            if (existingVisitor) {
                if (existingVisitor.lastVisitedAt < fifteenMinutesAgo) {
                    existingVisitor.visitCount += 1;
                    existingVisitor.lastVisitedAt = new Date();
                    yield existingVisitor.save();
                }
            }
            else {
                yield visitors_model_1.Visitor.create(visitorData);
            }
        }
        next();
    }
    catch (error) {
        // const response = await fetch('https://api.ipify.org?format=json');
        next(error);
    }
});
exports.visitorMiddleware = visitorMiddleware;
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
