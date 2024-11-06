import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  FileUploadHelper.upload.array('files', 10),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ProductController.createProduct(req, res, next);
  },
);

router.get('/', ProductController.getAllProduct);

router.get('/:id', ProductController.getSingleProduct);

export const ProductRoutes = router;
