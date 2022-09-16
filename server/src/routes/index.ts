import { Router } from 'express';
import chirpRoutes from './chirp';
import followRoutes from './follow';
import likeRoutes from './like';
import userRoutes from './user';
import currentUserRoutes from './currentUser';

const router = Router();

router.use('/', chirpRoutes, userRoutes);
router.use('/me', currentUserRoutes, followRoutes, likeRoutes);

export default router;
