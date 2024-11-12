import { NextFunction, Request, Response, Router } from 'express';
import { BlogController } from './blog.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post(
  '/create-blog',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return BlogController.createBlog(req, res, next);
  },
);

router.get('/', BlogController.getBlogs);

router.get('/:id', BlogController.getSingleBlog);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return BlogController.updateSingleBlog(req, res, next);
  },
);

router.delete('/:id', BlogController.deleteBlog);

export const BlogRoutes = router;
