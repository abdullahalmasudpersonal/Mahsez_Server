import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post('/create-buyer', UserController.createBuyer);

router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return UserController.createAdmin(req, res, next);
  },
);

router.get(
  '/me',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
  UserController.getMe,
);

router.patch(
  '/update-my-profile',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.buyer),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    return UserController.updateMyProfile(req, res, next);
  },
);

export const UserRoutes = router;
