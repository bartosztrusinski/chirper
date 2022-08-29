import { Router } from 'express';
import { getUserChirps } from '../controllers/chirp/all';
import { getUserPosts } from '../controllers/chirp/post';
import { getUserReplies } from '../controllers/chirp/reply';
import { getUserFollowers, getUserFollowing } from '../controllers/follow';
import { getLikedChirps } from '../controllers/like';
import {
  getAllUsers,
  signUpUser,
  logInUser,
  getUser,
} from '../controllers/user';

const router = Router();

router.get('/', getAllUsers);

router.post('/', signUpUser);

router.post('/login', logInUser);

router.get('/:username', getUser);

router.get('/:username/followers', getUserFollowers);

router.get('/:username/following', getUserFollowing);

router.get('/:username/liked-chirps', getLikedChirps);

router.get('/:username/posts', getUserPosts);
router.get('/:username/replies', getUserReplies);
router.get('/:username/all-chirps', getUserChirps);

export default router;
