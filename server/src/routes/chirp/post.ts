import { Router } from 'express';
import { createPost, deletePost, getPost } from '../../controllers/chirp/post';
import { isAuthenticated, isChirpAuthor } from '../../middleware/auth';

const router = Router();

router.post('/', isAuthenticated, createPost);

router.delete('/:chirpId', isAuthenticated, isChirpAuthor, deletePost);

router.get('/:chirpId', getPost);

export default router;
