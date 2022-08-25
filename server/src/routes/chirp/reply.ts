import { Router } from 'express';
import { deleteReply, getReply } from '../../controllers/chirp/reply';
import { isAuthenticated, isChirpAuthor } from '../../middleware/auth';

const router = Router();

router.delete('/:chirpId', isAuthenticated, isChirpAuthor, deleteReply);

router.get('/:chirpId', getReply);

export default router;
