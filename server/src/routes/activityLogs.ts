import { Router } from 'express';
import { getLogs, getStats } from '../controllers/activityController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticate);
router.get('/', getLogs);
router.get('/stats', getStats);
export default router;
