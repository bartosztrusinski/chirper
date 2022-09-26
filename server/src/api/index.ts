import { Router } from 'express';
import chirpRoutes from './chirps/chirp.routes';
import followRoutes from './follows/follow.routes';
import likeRoutes from './likes/like.routes';
import userRoutes from './users/routes/user.routes';
import currentUserRoutes from './users/routes/currentUser.routes';

const router = Router();

router.use('/', chirpRoutes, userRoutes);
router.use('/me', currentUserRoutes, followRoutes, likeRoutes);

export default router;
