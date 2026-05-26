import { Router } from 'express';
import { getRoles, updatePermissions } from '../controllers/roleController';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';

const router = Router();
router.use(authenticate);
router.get('/', requirePermission('view_analytics'), getRoles);
router.put('/:role/permissions', requirePermission('manage_roles'), updatePermissions);
export default router;
