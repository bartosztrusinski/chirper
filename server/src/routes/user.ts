import { Router } from 'express';
import * as userControllers from '../controllers/user';
import { authenticateAllowGuest } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdObject, objectId, usernameObject } from '../schemas/request';
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
  authenticateAllowGuest,
  validateRequest({
    currentUserId: objectId.optional(),
    query: userSchemas.searchMany,
  }),
  userControllers.searchMany
);

router.get(
  '/users/:username',
  validateRequest({
    params: usernameObject,
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
    params: usernameObject,
    query: userSchemas.findManyFollowed,
  }),
  userControllers.findManyFollowed
);

router.get(
  '/users/:username/followers',
  validateRequest({
    params: usernameObject,
    query: userSchemas.findManyFollowing,
  }),
  userControllers.findManyFollowing
);

router.get(
  '/chirps/:chirpId/liking-users',
  validateRequest({
    params: chirpIdObject,
    query: userSchemas.findManyLiking,
  }),
  userControllers.findManyLiking
);

export default router;
