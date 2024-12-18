"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose_1 = require("mongoose");
const visitorDeviceInfoSchema = new mongoose_1.Schema({
    device: { type: String, required: false },
    brand: { type: String, required: false },
    type: { type: String, required: false },
    os: { type: String, required: false },
    cpu: { type: String, required: false },
    osVersion: { type: String, required: false },
    browser: { type: String, required: false },
    browserVersion: { type: String, required: false },
});
const visitorIspInfoSchema = new mongoose_1.Schema({
    country: { type: String, required: false },
    region: { type: String, required: false },
    regionName: { type: String, required: false },
    city: { type: String, required: false },
    isp: { type: String, required: false },
    org: { type: String, required: false },
    as: { type: String, required: false },
    lat: { type: Number, required: false },
    lon: { type: Number, required: false },
    timezone: { type: String, required: false },
});
const visitorSchema = new mongoose_1.Schema({
    ip: {
        type: String,
        required: false,
    },
    sessionId: { type: String, required: false },
    visitCount: { type: Number, default: 1 },
    deviceInfo: visitorDeviceInfoSchema,
    ispInfo: visitorIspInfoSchema,
    visitedAt: { type: Date, default: Date.now },
    lastVisitedAt: { type: Date, required: false },
});
exports.Visitor = (0, mongoose_1.model)('Visitor', visitorSchema);
