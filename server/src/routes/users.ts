import { Router } from 'express';
import { getUsers, createUser, getUser, updateUser, deleteUser, toggleStatus } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';

const router = Router();
router.use(authenticate);
router.get('/', requirePermission('create_user'), getUsers);
router.post('/', requirePermission('create_user'), createUser);
router.get('/:id', requirePermission('edit_user'), getUser);
router.put('/:id', requirePermission('edit_user'), updateUser);
router.delete('/:id', requirePermission('delete_user'), deleteUser);
router.patch('/:id/status', requirePermission('edit_user'), toggleStatus);
export default router;
