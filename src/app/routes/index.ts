import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/Products/product.route';
import { OrderRoutes } from '../modules/order/order.route';
import { BlogRoutes } from '../modules/blogs/blog.route';
import { PyamentRoutes } from '../modules/payment/payment.route';
import { BuyerRoutes } from '../modules/buyer/buyer.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { visitorRoutes } from '../modules/visitors/visiotrs.routes';
import { ReviewRoutes } from '../modules/review/review.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/payment',
    route: PyamentRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/buyer',
    route: BuyerRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/visitor',
    route: visitorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
