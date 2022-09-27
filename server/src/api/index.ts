import { Router } from 'express';
import chirpRoutes from './chirps/chirp.routes';
import followRoutes from './follows/follow.routes';
import likeRoutes from './likes/like.routes';
import userRoutes from './users/user.routes';

const router = Router();

router.use('/', chirpRoutes, userRoutes);
router.use('/me', followRoutes, likeRoutes);

export default router;
