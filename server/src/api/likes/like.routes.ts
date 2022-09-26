import { Router } from 'express';
import * as likeControllers from './like.controllers';
import { authenticate, validateRequest } from '../../middlewares';
import { chirpIdObject, objectId } from '../../schemas';

const router = Router();

router.post(
  '/likes',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    body: chirpIdObject,
  }),
  likeControllers.createOne
);

router.delete(
  '/likes/:chirpId',
  authenticate,
  validateRequest({
    currentUserId: objectId,
    params: chirpIdObject,
  }),
  likeControllers.deleteOne
);

export default router;
