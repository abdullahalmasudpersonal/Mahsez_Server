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
const node_cron_1 = __importDefault(require("node-cron"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
const visitor_middleware_1 = require("./app/middlewares/visitor.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const setVisitorCookie_1 = require("./app/middlewares/setVisitorCookie");
const visitors_model_1 = require("./app/modules/visitors/visitors.model");
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
app.use((0, cookie_parser_1.default)());
app.use(setVisitorCookie_1.setVisitorCookie);
// প্রতিদিন রাত 12টায় পুরানো Session ID মুছে ফেলা
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    yield visitors_model_1.Visitor.deleteMany({ visitedAt: { $lt: oneDayAgo } });
    console.log('Old session IDs removed successfully.');
}));
app.use('/api/v1/product', visitor_middleware_1.visitorMiddleware);
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Mahsez Server In Progress!');
});
app.use(globalErrorhandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
