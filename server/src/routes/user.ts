import { Router } from 'express';
import {
  getReverseChronologicalTimeline,
  getUserChirps,
} from '../controllers/chirp/all';
import { getUserFollowers, getUserFollowing } from '../controllers/follow';
import { getLikedChirps } from '../controllers/like';
import { getUsers, signUpUser, logInUser, getUser } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:username', getUser);

router.post('/', signUpUser);
router.post('/login', logInUser);

router.get('/:username/followers', getUserFollowers);
router.get('/:username/following', getUserFollowing);

router.get('/:username/liked-chirps', getLikedChirps);

router.get('/:username/chirps', getUserChirps);

router.get(
  '/:username/timelines/reverse-chronological',
  getReverseChronologicalTimeline
);

export default router;
