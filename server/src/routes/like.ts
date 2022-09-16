import { Router } from 'express';
import * as likeControllers from '../controllers/like';
import { isAuthenticated } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdSchema, objectId } from '../schemas';

const router = Router();

router.post(
  '/likes',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: chirpIdSchema,
  }),
  likeControllers.createOne
);

router.delete(
  '/likes/:chirpId',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: chirpIdSchema,
  }),
  likeControllers.deleteOne
);

export default router;
