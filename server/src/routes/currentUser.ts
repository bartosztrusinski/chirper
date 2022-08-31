import { Router } from 'express';
import {
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUserEmail,
  updateCurrentUserPassword,
  updateCurrentUserProfile,
  updateCurrentUserUsername,
} from '../controllers/currentUser';
import { followUser, unfollowUser } from '../controllers/follow';
import { likeChirp, unlikeChirp } from '../controllers/like';
import { confirmPassword, isAuthenticated } from '../middleware/auth';

const router = Router();

router.get('/', isAuthenticated, getCurrentUser);

router.post('/following', isAuthenticated, followUser);
router.delete('/following/:username', isAuthenticated, unfollowUser);

router.post('/likes', isAuthenticated, likeChirp);
router.delete('/likes/:chirpId', isAuthenticated, unlikeChirp);

router.put('/profile', isAuthenticated, updateCurrentUserProfile);
router.put(
  '/password',
  isAuthenticated,
  confirmPassword,
  updateCurrentUserPassword
);
router.put(
  '/username',
  isAuthenticated,
  confirmPassword,
  updateCurrentUserUsername
);
router.put('/email', isAuthenticated, confirmPassword, updateCurrentUserEmail);
router.delete('/', isAuthenticated, confirmPassword, deleteCurrentUser);

export default router;
