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
exports.VisitorServices = void 0;
const visitors_model_1 = require("./visitors.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const visitor_constant_1 = require("./visitor.constant");
const getVisiotrIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const visitors = yield visitors_model_1.Visitor.find();
    const totalVisitCount = visitors.reduce((sum, visitor) => sum + (visitor.visitCount || 0), 0);
    return {
        visitors,
        totalVisitCount,
    };
});
const getVisitorsWithFilterWithSearchIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const visitorquery = new QueryBuilder_1.default(visitors_model_1.Visitor.find(), query)
        .search(visitor_constant_1.visitorSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const meta = yield visitorquery.countTotal();
    const result = yield visitorquery.modelQuery;
    return {
        meta,
        result,
    };
});
exports.VisitorServices = {
    getVisiotrIntoDB,
    getVisitorsWithFilterWithSearchIntoDB,
};
