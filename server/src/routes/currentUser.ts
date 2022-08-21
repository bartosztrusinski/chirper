import { Router } from 'express';
import { getCurrentUser } from '../controllers/currentUser';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getCurrentUser);

export default router;
