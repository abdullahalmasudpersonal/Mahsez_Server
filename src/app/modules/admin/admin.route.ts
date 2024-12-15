import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();

router.get('/', AdminController.getAdmins);

router.patch('/update-online-status', AdminController.updateOnlineStatus);

export const AdminRoutes = router;
