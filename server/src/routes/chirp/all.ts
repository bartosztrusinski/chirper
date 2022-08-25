import { Router } from 'express';
import { createReply } from '../../controllers/chirp/reply';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/:chirpId/replies', isAuthenticated, createReply);

export default router;
