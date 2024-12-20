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
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const user_model_1 = require("./app/modules/User/user.model");
let server;
let io;
function mahsezServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.databaseUrl);
            server = new http_1.Server(app_1.default);
            io = new socket_io_1.Server(server, {
                cors: {
                    origin: ['https://mahsez.vercel.app', 'http://localhost:5173'],
                    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
                    credentials: true,
                },
                pingTimeout: 60000,
                transports: ['websocket'],
            });
            io.on('connection', (socket) => {
                socket.on('userOnline', (id) => __awaiter(this, void 0, void 0, function* () {
                    socket.userId = id;
                    yield user_model_1.User.findOneAndUpdate({ id: id }, { isOnline: true });
                }));
                socket.on('userOffline', (userId) => __awaiter(this, void 0, void 0, function* () {
                    yield user_model_1.User.findOneAndUpdate({ id: userId }, { isOnline: false });
                }));
                socket.on('disconnect', (id) => __awaiter(this, void 0, void 0, function* () {
                    if (socket.userId) {
                        yield user_model_1.User.findOneAndUpdate({ id: socket.userId }, { isOnline: false });
                    }
                }));
            });
            server.listen(config_1.default.port, () => {
                console.log(`Mahsez Server listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log('Error starting server:', error);
        }
    });
}
mahsezServer();
// import app from './app';
// import mongoose from 'mongoose';
// import config from './app/config';
// import { Server } from 'http';
// let server: Server;
// async function mahsezServer() {
//   try {
//     await mongoose.connect(config.databaseUrl as string);
//     server = app.listen(config.port, () => {
//       console.log(`Mahsez Server listening on port ${config.port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
// mahsezServer();
