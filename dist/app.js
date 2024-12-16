"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
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
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.send('Mahsez Server In Progress!');
});
app.use(globalErrorhandler_1.default);
// not found
app.use(notFound_1.default);
exports.default = app;
