import { Router } from 'express';
import * as followControllers from '../controllers/follow';
import { isAuthenticated } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { objectId, usernameInput } from '../schemas';

const router = Router();

router.post(
  '/following',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: usernameInput,
  }),
  followControllers.createOne
);

router.delete(
  '/following/:username',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: usernameInput,
  }),
  followControllers.deleteOne
);

export default router;
