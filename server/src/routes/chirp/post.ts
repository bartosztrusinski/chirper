import { Router } from 'express';
import { createPost, getPost } from '../../controllers/chirp/post';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.get('/:chirpId', getPost);
router.post('/', isAuthenticated, createPost);

export default router;
