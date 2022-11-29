import { Router } from 'express';
import * as chirpControllers from './chirp.controllers.';
import * as chirpSchemas from './chirp.schemas';
import {
  authenticate,
  authenticateAllowGuest,
  authorize,
  validateRequest,
} from '../../middlewares';

const router = Router();

router
  .route('/chirps')
  .get([validateRequest(chirpSchemas.findMany)], chirpControllers.findMany)
  .post(
    [authenticate, validateRequest(chirpSchemas.createOne)],
    chirpControllers.createOne
  );

router
  .route('/chirps/:chirpId')
  .get([validateRequest(chirpSchemas.findOne)], chirpControllers.findOne)
  .delete(
    [authenticate, validateRequest(chirpSchemas.deleteOne), authorize],
    chirpControllers.deleteOne
  );

router.get(
  '/chirps/search',
  [authenticateAllowGuest, validateRequest(chirpSchemas.searchMany)],
  chirpControllers.searchMany
);

router.get(
  '/chirps/:chirpId/replies',
  [validateRequest(chirpSchemas.getReplies)],
  chirpControllers.getReplies
);

router.get(
  '/users/:username/chirps',
  [validateRequest(chirpSchemas.findManyByUser)],
  chirpControllers.findManyByUser
);

router.get(
  '/users/:username/liked-chirps',
  [validateRequest(chirpSchemas.findManyLiked)],
  chirpControllers.findManyLiked
);

router.get(
  '/users/:username/timelines/reverse-chronological',
  [validateRequest(chirpSchemas.getUserTimeline)],
  chirpControllers.getUserTimeline
);

export default router;
