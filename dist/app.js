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
app.use('/api/v1', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === '/') {
        return next(); // ফেভিকন রিকোয়েস্ট স্কিপ করুন
    }
    console.log(`Middleware triggered for path: ${req.path}`);
    try {
        const ip = request_ip_1.default.getClientIp(req);
        // const currentData = new Date();
        // const formattedDate1 = currentData.toString().split('T')[0];
        // console.log(formattedDate1, 'todate');
        // if(ip){
        //   const visitor = await Visitor.find({ ip, visitedAt:''})
        // }
        const geoApiUrl = `http://ip-api.com/json/${ip}`;
        const geoResponse = yield axios_1.default.get(geoApiUrl);
        const geoData = geoResponse.data;
        console.log(geoData, 'gio data');
        const userAgent = req.headers['user-agent'];
        const visitorData = {
            ip: ip,
            gioData: geoData,
            userAgent: userAgent,
        };
        // console.log(visitorData, 'visiotrdAta');
        const newVisitor = yield visitors_model_1.Visitor.create(visitorData);
        // console.log(newVisitor, 'new visitor');
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
