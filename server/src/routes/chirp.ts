import { Router } from 'express';
import * as chirpControllers from '../controllers/chirp';
import { isAuthenticated, isChirpAuthor } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { chirpIdSchema, objectId, usernameInput } from '../schemas';
import * as chirpSchemas from '../schemas/chirp';

const router = Router();

router.get(
  '/chirps',
  validateRequest({
    query: chirpSchemas.getChirps,
  }),
  chirpControllers.findMany
);

router.get(
  '/chirps/search',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    query: chirpSchemas.searchChirps,
  }),
  chirpControllers.searchMany
);

router.get(
  '/chirps/:chirpId',
  validateRequest({
    params: chirpIdSchema,
    query: chirpSchemas.getChirp,
  }),
  chirpControllers.findOne
);

router.post(
  '/chirps',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    body: chirpSchemas.createChirp,
  }),
  chirpControllers.createOne
);

router.delete(
  '/chirps/:chirpId',
  isAuthenticated,
  validateRequest({
    currentUserId: objectId,
    params: chirpIdSchema,
  }),
  isChirpAuthor,
  chirpControllers.deleteOne
);

router.get(
  '/users/:username/chirps',
  validateRequest({
    query: chirpSchemas.getUserChirps,
    params: usernameInput,
  }),
  chirpControllers.findManyByUser
);

router.get(
  '/users/:username/liked-chirps',
  validateRequest({
    params: usernameInput,
    query: chirpSchemas.getLikedChirps,
  }),
  chirpControllers.findManyLiked
);

router.get(
  '/users/:username/timelines/reverse-chronological',
  validateRequest({
    query: chirpSchemas.reverseChronologicalTimeline,
    params: usernameInput,
  }),
  chirpControllers.getUserTimeline
);

export default router;
