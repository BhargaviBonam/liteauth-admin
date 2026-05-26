import { Router } from 'express';
import { updateProfile, uploadAvatar } from '../controllers/profileController';
import { authenticate } from '../middleware/authMiddleware';
import { uploadAvatar as uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();
router.use(authenticate);
router.put('/', updateProfile);
router.post('/avatar', uploadMiddleware, uploadAvatar);
export default router;
