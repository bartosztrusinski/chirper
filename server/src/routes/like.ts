import { Router } from 'express';
import * as likeControllers from '../controllers/like';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdObject, objectId } from '../schemas/request';

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
