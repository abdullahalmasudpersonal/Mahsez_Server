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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVisitorCookie = void 0;
const uuid_1 = require("uuid");
const setVisitorCookie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.sessionId) {
        // কুকিতে Session ID সেট করা
        const sessionId = (0, uuid_1.v4)(); // ইউনিক স্ট্রিং তৈরি
        res.cookie('sessionId', sessionId, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
            sameSite: 'lax', // CSRF Protection
        });
        console.log('New Session ID created:', sessionId);
    }
    else {
        console.log('Existing Session ID:', req.cookies.sessionId);
    }
    next();
});
exports.setVisitorCookie = setVisitorCookie;
