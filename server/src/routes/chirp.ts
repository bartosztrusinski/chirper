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
import { chirpIdSchema, currentUserIdSchema } from '../schemas';
import { validateRequest } from '../middleware/validation';
import {
  createChirpBody,
  getChirpQuery,
  getChirpsQuery,
  searchChirpsQuery,
} from '../schemas/chirp';
import { getLikingUsersQuery } from '../schemas/like';

const router = Router();

router.get(
  '/',
  validateRequest({
    query: getChirpsQuery,
  }),
  getChirps
);

router.get(
  '/search',
  isAuthenticated,
  validateRequest({
    query: searchChirpsQuery,
    currentUserId: currentUserIdSchema,
  }),
  searchChirps
);

router.get(
  '/:chirpId',
  validateRequest({
    params: chirpIdSchema,
    query: getChirpQuery,
  }),
  getChirp
);

router.post(
  '/',
  isAuthenticated,
  validateRequest({
    body: createChirpBody,
    currentUserId: currentUserIdSchema,
  }),
  createChirp
);

router.delete(
  '/:chirpId/',
  isAuthenticated,
  validateRequest({
    params: chirpIdSchema,
    currentUserId: currentUserIdSchema,
  }),
  isChirpAuthor,
  deleteChirp
);

router.get(
  '/:chirpId/liking-users',
  validateRequest({
    params: chirpIdSchema,
    query: getLikingUsersQuery,
  }),
  getLikingUsers
);

export default router;
