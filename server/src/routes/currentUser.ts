import { Router } from 'express';
import * as currentUserControllers from '../controllers/currentUser';
import { passwordAuthenticate, authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { objectId } from '../schemas/request';
import * as currentUserSchemas from '../schemas/user';

const router = Router();

router.get(
  '/',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    query: currentUserSchemas.findOne,
  }),
  currentUserControllers.findOne
);

router.put(
  '/profile',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateProfile,
  }),
  currentUserControllers.updateProfile
);

router.put(
  '/password',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updatePassword,
  }),
  passwordAuthenticate,
  currentUserControllers.updatePassword
);

router.put(
  '/username',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateUsername,
  }),
  passwordAuthenticate,
  currentUserControllers.updateUsername
);

router.put(
  '/email',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateEmail,
  }),
  passwordAuthenticate,
  currentUserControllers.updateEmail
);

router.delete(
  '/',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.deleteOne,
  }),
  passwordAuthenticate,
  currentUserControllers.deleteOne
);

export default router;
