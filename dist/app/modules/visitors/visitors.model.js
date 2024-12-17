"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose_1 = require("mongoose");
const visitorSchema = new mongoose_1.Schema({
    ip: {
        type: String,
        required: true,
    },
    userAgent: { type: String, required: false },
    visitedAt: { type: Date, default: Date.now },
    country: {
        type: String,
        required: false,
    },
    region: {
        type: String,
        required: false,
    },
    regionName: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    isp: {
        type: String,
        required: false,
    },
    org: {
        type: String,
        required: false,
    },
    as: {
        type: String,
        required: false,
    },
    lat: {
        type: Number,
        required: false,
    },
    lon: {
        type: Number,
        required: false,
    },
    timezone: {
        type: String,
        required: false,
    },
});
exports.Visitor = (0, mongoose_1.model)('Visitor', visitorSchema);
