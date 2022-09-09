import { Router } from 'express';
import {
  getReverseChronologicalTimeline,
  getUserChirps,
} from '../controllers/chirp';
import { getUserFollowers, getUserFollowings } from '../controllers/follow';
import { getLikedChirps } from '../controllers/like';
import {
  getUsers,
  signUpUser,
  logInUser,
  getUser,
  searchUsers,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:username', getUser);
router.get('/:username/chirps', getUserChirps);
router.get(
  '/:username/timelines/reverse-chronological',
  getReverseChronologicalTimeline
);

router.post('/', signUpUser);
router.post('/login', logInUser);

router.get('/:username/followers', getUserFollowers);
router.get('/:username/following', getUserFollowings);

router.get('/:username/liked-chirps', getLikedChirps);

export default router;
