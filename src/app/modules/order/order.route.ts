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

export const OrderRoutes = router;
