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

router.get(
  '/revinew',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.getRevinew,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
  OrderController.GetSingleOrder,
);

router.patch(
  '/update-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OrderController.updateOrderstatus,
);

export const OrderRoutes = router;
