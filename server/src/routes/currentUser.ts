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
import { chirpIdSchema, objectId, usernameInput } from '../schemas';
import * as currentUserSchemas from '../schemas/currentUser';
import * as userSchemas from '../schemas/user';

const router = Router();

router.get(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    query: userSchemas.getUser,
  }),
  getCurrentUser
);

router.put(
  '/profile',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateProfile,
  }),
  updateCurrentUserProfile
);

router.put(
  '/password',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updatePassword,
  }),
  confirmPassword,
  updateCurrentUserPassword
);

router.put(
  '/username',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateUsername,
  }),
  confirmPassword,
  updateCurrentUserUsername
);

router.put(
  '/email',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateEmail,
  }),
  confirmPassword,
  updateCurrentUserEmail
);

router.delete(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
  }),
  confirmPassword,
  deleteCurrentUser
);

router.post(
  '/following',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: usernameInput,
  }),
  followUser
);

router.delete(
  '/following/:username',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: usernameInput,
  }),
  unfollowUser
);

router.post(
  '/likes',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: chirpIdSchema,
  }),
  likeChirp
);

router.delete(
  '/likes/:chirpId',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: chirpIdSchema,
  }),
  unlikeChirp
);

export default router;
