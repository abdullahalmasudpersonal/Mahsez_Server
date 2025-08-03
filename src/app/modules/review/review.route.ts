import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ReviewController } from './review.controller';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post(
  '/create-review',
  auth(USER_ROLE.buyer),
  FileUploadHelper.upload.array('files', 10),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ReviewController.createReview(req, res, next);
  },
);

export const ReviewRoutes = router;
