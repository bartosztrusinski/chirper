import { Router } from 'express';
import { createReply } from '../../controllers/chirp/reply';
import { getLikingUsers } from '../../controllers/like';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/:chirpId/replies', isAuthenticated, createReply);

router.get('/:chirpId/liking-users', getLikingUsers);

export default router;
