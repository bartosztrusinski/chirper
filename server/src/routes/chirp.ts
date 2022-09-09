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

const router = Router();

router.get('/', getChirps);
router.get('/search', searchChirps);
router.get('/:chirpId', getChirp);

router.post('/', isAuthenticated, createChirp);
router.delete('/:chirpId/', isAuthenticated, isChirpAuthor, deleteChirp);

router.get('/:chirpId/liking-users', getLikingUsers);

export default router;
