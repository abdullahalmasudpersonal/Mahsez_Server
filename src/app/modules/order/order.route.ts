import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { OrderController } from './order.controller';

const router = Router();

router.post(
  '/create-order',
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  OrderController.createOrder,
);

router.get(
  '/buyer-order',
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  OrderController.getBuyerOrder,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.GetAllorder,
);

export const OrderRoutes = router;
