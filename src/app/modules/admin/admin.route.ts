import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/', AdminController.getAdmins);

export const AdminRoutes = router;
