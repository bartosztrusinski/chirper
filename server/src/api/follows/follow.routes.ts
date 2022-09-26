import { Router } from 'express';
import * as followControllers from './follow.controllers';
import { authenticate } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validation';
import { objectId, usernameObject } from '../../schemas/request';

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
