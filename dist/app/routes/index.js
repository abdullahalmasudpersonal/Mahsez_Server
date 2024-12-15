"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const product_route_1 = require("../modules/Products/product.route");
const order_route_1 = require("../modules/order/order.route");
const blog_route_1 = require("../modules/blogs/blog.route");
const payment_route_1 = require("../modules/payment/payment.route");
const buyer_route_1 = require("../modules/buyer/buyer.route");
const admin_route_1 = require("../modules/admin/admin.route");
const visiotrs_routes_1 = require("../modules/visitors/visiotrs.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/product',
        route: product_route_1.ProductRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/order',
        route: order_route_1.OrderRoutes,
    },
    {
        path: '/blog',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PyamentRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes,
    },
    {
        path: '/buyer',
        route: buyer_route_1.BuyerRoutes,
    },
    {
        path: '/visitor',
        route: visiotrs_routes_1.visitorRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
