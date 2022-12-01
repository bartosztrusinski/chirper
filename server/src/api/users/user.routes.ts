import { Router } from 'express';
import * as userControllers from './user.controllers';
import * as userSchemas from './user.schemas.';
import {
  authenticateAllowGuest,
  validateRequest,
  passwordAuthenticate,
  authenticate,
} from '../../middlewares';

const router = Router();

router
  .route('/users')
  .head([validateRequest(userSchemas.exists)], userControllers.exists)
  .get([validateRequest(userSchemas.findMany)], userControllers.findMany)
  .post([validateRequest(userSchemas.signUp)], userControllers.signUp);

router.post(
  '/users/login',
  [validateRequest(userSchemas.logIn)],
  userControllers.logIn
);

router.get(
  '/users/search',
  [authenticateAllowGuest, validateRequest(userSchemas.searchMany)],
  userControllers.searchMany
);

router.get(
  '/users/:username',
  [validateRequest(userSchemas.findOne)],
  userControllers.findOne
);

router.get(
  '/users/:username/followed',
  [validateRequest(userSchemas.findManyFollowed)],
  userControllers.findManyFollowed
);

router.get(
  '/users/:username/following',
  [validateRequest(userSchemas.findManyFollowing)],
  userControllers.findManyFollowing
);

router.get(
  '/chirps/:chirpId/liking-users',
  [validateRequest(userSchemas.findManyLiking)],
  userControllers.findManyLiking
);

router
  .route('/me')
  .get(
    [authenticate, validateRequest(userSchemas.findCurrentOne)],
    userControllers.findCurrentOne
  )
  .delete(
    [
      authenticate,
      validateRequest(userSchemas.deleteOne),
      passwordAuthenticate,
    ],
    userControllers.deleteOne
  );

router.put(
  '/me/profile',
  [authenticate, validateRequest(userSchemas.updateProfile)],
  userControllers.updateProfile
);

router.put(
  '/me/password',
  [
    authenticate,
    validateRequest(userSchemas.updatePassword),
    passwordAuthenticate,
  ],
  userControllers.updatePassword
);

router.put(
  '/me/username',
  [
    authenticate,
    validateRequest(userSchemas.updateUsername),
    passwordAuthenticate,
  ],
  userControllers.updateUsername
);

router.put(
  '/me/email',
  [
    authenticate,
    validateRequest(userSchemas.updateEmail),
    passwordAuthenticate,
  ],
  userControllers.updateEmail
);

export default router;
