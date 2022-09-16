import { Router } from 'express';
import * as currentUserControllers from '../controllers/currentUser';
import { confirmPassword, isAuthenticated } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { objectId } from '../schemas';
import * as currentUserSchemas from '../schemas/currentUser';

const router = Router();

router.get(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    query: currentUserSchemas.findOne,
  }),
  currentUserControllers.getOne
);

router.put(
  '/profile',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateProfile,
  }),
  currentUserControllers.updateProfile
);

router.put(
  '/password',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updatePassword,
  }),
  confirmPassword,
  currentUserControllers.updatePassword
);

router.put(
  '/username',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateUsername,
  }),
  confirmPassword,
  currentUserControllers.updateUsername
);

router.put(
  '/email',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: currentUserSchemas.updateEmail,
  }),
  confirmPassword,
  currentUserControllers.updateEmail
);

router.delete(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
  }),
  confirmPassword,
  currentUserControllers.deleteOne
);

export default router;
