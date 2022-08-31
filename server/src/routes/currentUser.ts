import { Router } from 'express';
import { getCurrentUser } from '../controllers/currentUser';
import { followUser, unfollowUser } from '../controllers/follow';
import { likeChirp, unlikeChirp } from '../controllers/like';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getCurrentUser);

router.post('/following', isAuthenticated, followUser);

router.delete('/following/:username', isAuthenticated, unfollowUser);

router.post('/likes', isAuthenticated, likeChirp);

router.delete('/likes/:chirpId', isAuthenticated, unlikeChirp);

export default router;
