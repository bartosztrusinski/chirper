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
import { validateRequest } from '../middleware/validation';
import { chirpIdSchema, currentUserIdSchema, usernameSchema } from '../schemas';
import {
  updateCurrentUserEmailBody,
  updateCurrentUserPasswordBody,
  updateCurrentUserProfileBody,
  updateCurrentUserUsernameBody,
} from '../schemas/currentUser';
import { getUserQuery } from '../schemas/user';

const router = Router();

router.get(
  '/',
  isAuthenticated,
  validateRequest({
    query: getUserQuery,
    currentUserId: currentUserIdSchema,
  }),
  getCurrentUser
);

router.put(
  '/profile',
  isAuthenticated,
  validateRequest({
    body: updateCurrentUserProfileBody,
    currentUserId: currentUserIdSchema,
  }),
  updateCurrentUserProfile
);

router.put(
  '/password',
  isAuthenticated,
  validateRequest({
    body: updateCurrentUserPasswordBody,
    currentUserId: currentUserIdSchema,
  }),
  confirmPassword,
  updateCurrentUserPassword
);

router.put(
  '/username',
  isAuthenticated,
  validateRequest({
    body: updateCurrentUserUsernameBody,
    currentUserId: currentUserIdSchema,
  }),
  confirmPassword,
  updateCurrentUserUsername
);

router.put(
  '/email',
  isAuthenticated,
  validateRequest({
    body: updateCurrentUserEmailBody,
    currentUserId: currentUserIdSchema,
  }),
  confirmPassword,
  updateCurrentUserEmail
);

router.delete(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: currentUserIdSchema,
  }),
  confirmPassword,
  deleteCurrentUser
);

router.post(
  '/following',
  isAuthenticated,
  validateRequest({
    body: usernameSchema,
    currentUserId: currentUserIdSchema,
  }),
  followUser
);

router.delete(
  '/following/:username',
  isAuthenticated,
  validateRequest({
    params: usernameSchema,
    currentUserId: currentUserIdSchema,
  }),
  unfollowUser
);

router.post(
  '/likes',
  isAuthenticated,
  validateRequest({
    body: chirpIdSchema,
    currentUserId: currentUserIdSchema,
  }),
  likeChirp
);

router.delete(
  '/likes/:chirpId',
  isAuthenticated,
  validateRequest({
    params: chirpIdSchema,
    currentUserId: currentUserIdSchema,
  }),
  unlikeChirp
);

export default router;
