"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose_1 = require("mongoose");
const visitorSchema = new mongoose_1.Schema({
    ip: {
        type: String,
        required: true,
    },
    userAgent: { type: String, required: true },
    visitedAt: { type: Date, default: Date.now },
});
exports.Visitor = (0, mongoose_1.model)('Visitor', visitorSchema);
