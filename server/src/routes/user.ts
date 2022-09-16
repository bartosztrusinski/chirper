import { Router } from 'express';
import * as userControllers from '../controllers/user';
import { isAuthenticated } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdSchema, usernameInput } from '../schemas';
import * as userSchemas from '../schemas/user';

const router = Router();

router.get(
  '/users',
  validateRequest({
    query: userSchemas.getUsers,
  }),
  userControllers.findMany
);

router.get(
  '/users/search',
  isAuthenticated,
  validateRequest({
    query: userSchemas.searchUsers,
  }),
  userControllers.searchMany
);

router.get(
  '/users/:username',
  validateRequest({
    params: usernameInput,
    query: userSchemas.getUser,
  }),
  userControllers.findOne
);

router.post(
  '/users',
  validateRequest({
    body: userSchemas.signUpUser,
  }),
  userControllers.signUp
);

router.post(
  '/users/login',
  validateRequest({
    body: userSchemas.logInUser,
  }),
  userControllers.logIn
);

router.get(
  '/users/:username/following',
  validateRequest({
    params: usernameInput,
    query: userSchemas.getUserFollowings,
  }),
  userControllers.findManyFollowing
);

router.get(
  '/users/:username/followers',
  validateRequest({
    params: usernameInput,
    query: userSchemas.getUserFollowers,
  }),
  userControllers.findManyFollowers
);

router.get(
  '/chirps/:chirpId/liking-users',
  validateRequest({
    params: chirpIdSchema,
    query: userSchemas.getLikingUsers,
  }),
  userControllers.findManyLiking
);

export default router;
