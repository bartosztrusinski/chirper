import { Router } from 'express';
import { authenticate, validateRequest } from '../../middlewares';
import * as followControllers from './follow.controllers';
import * as followSchemas from './follow.schemas';

const router = Router();

router.post(
  '/following',
  [authenticate, validateRequest(followSchemas.createOne)],
  followControllers.createOne
);

router.delete(
  '/following/:username',
  [authenticate, validateRequest(followSchemas.deleteOne)],
  followControllers.deleteOne
);

export default router;
