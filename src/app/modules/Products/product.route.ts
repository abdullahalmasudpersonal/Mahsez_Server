import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { FileUploadHelper } from '../../utils/fileUploadHelper';

const router = Router();

router.post(
  '/create-product',
  auth(USER_ROLE.admin),
  FileUploadHelper.upload.array('files', 6),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ProductController.createProduct(req, res, next);
  },
);

router.get('/', ProductController.getAllProduct);

router.get('/search-filter', ProductController.getAllProductWithSearchFilter);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/update-product/:id',
  auth(USER_ROLE.admin),
  FileUploadHelper.upload.array('files', 6),
  (req: Request, res: Response, next: NextFunction) => {
    //  এখানে JSON.parce(req.body.data) করা যাবে না, করলে existingFiles পাওয়া যাবে না। 
    return ProductController.updateProduct(req, res, next);
  },
);

router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
