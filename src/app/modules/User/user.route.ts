import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.post('/create-buyer', UserController.createBuyer);

router.post('/create-admin', UserController.createAdmin);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
  UserController.getMe,
);

export const UserRoutes = router;
