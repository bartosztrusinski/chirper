import { Router } from 'express';
import { authenticate, validateRequest } from '../../middlewares';
import * as likeControllers from './like.controllers';
import * as likeSchemas from './like.schemas';

const router = Router();

router.post(
  '/likes',
  [authenticate, validateRequest(likeSchemas.createOne)],
  likeControllers.createOne
);

router.delete(
  '/likes/:chirpId',
  [authenticate, validateRequest(likeSchemas.deleteOne)],
  likeControllers.deleteOne
);

export default router;
