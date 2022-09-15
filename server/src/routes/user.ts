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
import { isAuthenticated } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { usernameInput } from '../schemas';
import * as chirpSchemas from '../schemas/chirp';
import * as followSchemas from '../schemas/follow';
import * as likeSchemas from '../schemas/like';
import * as userSchemas from '../schemas/user';

const router = Router();

router.get(
  '/',
  validateRequest({
    query: userSchemas.getUsers,
  }),
  getUsers
);

router.get(
  '/search',
  isAuthenticated,
  validateRequest({
    query: userSchemas.searchUsers,
  }),
  searchUsers
);

router.get(
  '/:username',
  validateRequest({
    params: usernameInput,
    query: userSchemas.getUser,
  }),
  getUser
);

router.get(
  '/:username/chirps',
  validateRequest({
    query: userSchemas.getUserChirps,
    params: usernameInput,
  }),
  getUserChirps
);

router.get(
  '/:username/timelines/reverse-chronological',
  validateRequest({
    query: chirpSchemas.reverseChronologicalTimeline,
    params: usernameInput,
  }),
  getReverseChronologicalTimeline
);

router.post(
  '/',
  validateRequest({
    body: userSchemas.signUpUser,
  }),
  signUpUser
);

router.post(
  '/login',
  validateRequest({
    body: userSchemas.logInUser,
  }),
  logInUser
);

router.get(
  '/:username/following',
  validateRequest({
    params: usernameInput,
    query: followSchemas.getUserFollowings,
  }),
  getUserFollowings
);

router.get(
  '/:username/followers',
  validateRequest({
    params: usernameInput,
    query: followSchemas.getUserFollowers,
  }),
  getUserFollowers
);

router.get(
  '/:username/liked-chirps',
  validateRequest({
    params: usernameInput,
    query: likeSchemas.getLikedChirps,
  }),
  getLikedChirps
);

export default router;
