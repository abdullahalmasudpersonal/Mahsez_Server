"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const mongoose_1 = require("mongoose");
const visitorSchema = new mongoose_1.Schema({
    count: {
        type: Number,
        required: true,
    },
});
exports.Visitor = (0, mongoose_1.model)("Visitor", visitorSchema);
