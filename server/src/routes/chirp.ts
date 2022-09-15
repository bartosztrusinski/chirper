import { Router } from 'express';
import {
  getChirps,
  getChirp,
  searchChirps,
  createChirp,
  deleteChirp,
} from '../controllers/chirp';
import { getLikingUsers } from '../controllers/like';
import { isAuthenticated, isChirpAuthor } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdSchema, objectId } from '../schemas';
import * as chirpSchemas from '../schemas/chirp';
import * as likeSchemas from '../schemas/like';

const router = Router();

router.get(
  '/',
  validateRequest({
    query: chirpSchemas.getChirps,
  }),
  getChirps
);

router.get(
  '/search',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    query: chirpSchemas.searchChirps,
  }),
  searchChirps
);

router.get(
  '/:chirpId',
  validateRequest({
    params: chirpIdSchema,
    query: chirpSchemas.getChirp,
  }),
  getChirp
);

router.post(
  '/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: chirpSchemas.createChirp,
  }),
  createChirp
);

router.delete(
  '/:chirpId/',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: chirpIdSchema,
  }),
  isChirpAuthor,
  deleteChirp
);

router.get(
  '/:chirpId/liking-users',
  validateRequest({
    params: chirpIdSchema,
    query: likeSchemas.getLikingUsers,
  }),
  getLikingUsers
);

export default router;
