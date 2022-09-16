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
    query: userSchemas.findMany,
  }),
  userControllers.findMany
);

router.get(
  '/users/search',
  isAuthenticated,
  validateRequest({
    query: userSchemas.searchMany,
  }),
  userControllers.searchMany
);

router.get(
  '/users/:username',
  validateRequest({
    params: usernameInput,
    query: userSchemas.findOne,
  }),
  userControllers.findOne
);

router.post(
  '/users',
  validateRequest({
    body: userSchemas.signUp,
  }),
  userControllers.signUp
);

router.post(
  '/users/login',
  validateRequest({
    body: userSchemas.logIn,
  }),
  userControllers.logIn
);

router.get(
  '/users/:username/following',
  validateRequest({
    params: usernameInput,
    query: userSchemas.findManyFollowing,
  }),
  userControllers.findManyFollowing
);

router.get(
  '/users/:username/followers',
  validateRequest({
    params: usernameInput,
    query: userSchemas.findManyFollowers,
  }),
  userControllers.findManyFollowers
);

router.get(
  '/chirps/:chirpId/liking-users',
  validateRequest({
    params: chirpIdSchema,
    query: userSchemas.findManyLiking,
  }),
  userControllers.findManyLiking
);

export default router;
