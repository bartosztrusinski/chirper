import { Router } from 'express';
import { createReply, getReply } from '../../controllers/chirp/reply';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.get('/:chirpId', getReply);
router.post('/', isAuthenticated, createReply);

export default router;
