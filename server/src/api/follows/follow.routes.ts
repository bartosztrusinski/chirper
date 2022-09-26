import { Router } from 'express';
import * as followControllers from './follow.controllers';
import { authenticate, validateRequest } from '../../middlewares';
import { objectId, usernameObject } from '../../schemas';

const router = Router();

router.post(
  '/following',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: usernameObject,
  }),
  followControllers.createOne
);

router.delete(
  '/following/:username',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    params: usernameObject,
  }),
  followControllers.deleteOne
);

export default router;
