import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { PaymentController } from './payment.controller';

const router = Router();

router.get(
  '/buyer-payment',
  auth(USER_ROLE.buyer, USER_ROLE.admin),
  PaymentController.getBuyerPayment,
);

export const PyamentRoutes = router;
