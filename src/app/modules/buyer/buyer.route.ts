import { Router } from 'express';
import { BuyerController } from './buyer.controller';

const router = Router();

router.get('/', BuyerController.getBuyers);

export const BuyerRoutes = router;
