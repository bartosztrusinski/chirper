import { Router } from 'express';
import * as followControllers from '../controllers/follow';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { objectId, usernameInput } from '../schemas';

const router = Router();

router.post(
  '/following',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: usernameInput,
  }),
  followControllers.createOne
);

router.delete(
  '/following/:username',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    params: usernameInput,
  }),
  followControllers.deleteOne
);

export default router;
