import { Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  ProductController.createProduct,
);

router.get('/', ProductController.getAllProduct);

export const ProductRoutes = router;
