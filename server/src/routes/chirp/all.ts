import { Router } from 'express';
import { deleteChirp, searchChirps } from '../../controllers/chirp/all';
import { getLikingUsers } from '../../controllers/like';
import { isAuthenticated, isChirpAuthor } from '../../middleware/auth';

const router = Router();

router.get('/:chirpId/liking-users', getLikingUsers);
router.delete('/:chirpId/', isAuthenticated, isChirpAuthor, deleteChirp);

router.get('/search', searchChirps);

export default router;
