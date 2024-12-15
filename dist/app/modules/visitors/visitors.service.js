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
exports.VisitorServices = void 0;
const visitors_model_1 = require("./visitors.model");
const createVisiotrIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let visitor = yield visitors_model_1.Visitor.findOne();
        if (!visitor) {
            visitor = new visitors_model_1.Visitor({ count: 1 });
        }
        else {
            visitor.count += 1;
        }
        yield visitor.save();
    }
    catch (err) {
        console.log(err);
    }
});
exports.VisitorServices = {
    createVisiotrIntoDB,
};
