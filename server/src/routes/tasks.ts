import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';
import { requirePermission } from '../middleware/rbacMiddleware';

const router = Router();
router.use(authenticate);
router.get('/', requirePermission('view_analytics'), getTasks);
router.post('/', requirePermission('create_task'), createTask);
router.put('/:id', requirePermission('edit_task'), updateTask);
router.delete('/:id', requirePermission('delete_task'), deleteTask);
export default router;
