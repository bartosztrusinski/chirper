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
import { usernameSchema } from '../schemas';
import { reverseChronologicalTimelineQuery } from '../schemas/chirp';
import {
  getUserFollowersQuery,
  getUserFollowingsQuery,
} from '../schemas/follow';
import { getLikedChirpsQuery } from '../schemas/like';
import {
  getUserChirpsQuery,
  getUserQuery,
  getUsersQuery,
  logInUserBody,
  searchUsersQuery,
  signUpUserBody,
} from '../schemas/user';

const router = Router();

router.get(
  '/',
  validateRequest({
    query: getUsersQuery,
  }),
  getUsers
);

router.get(
  '/search',
  isAuthenticated,
  validateRequest({
    query: searchUsersQuery,
  }),
  searchUsers
);

router.get(
  '/:username',
  validateRequest({
    params: usernameSchema,
    query: getUserQuery,
  }),
  getUser
);

router.get(
  '/:username/chirps',
  validateRequest({
    query: getUserChirpsQuery,
    params: usernameSchema,
  }),
  getUserChirps
);

router.get(
  '/:username/timelines/reverse-chronological',
  validateRequest({
    query: reverseChronologicalTimelineQuery,
    params: usernameSchema,
  }),
  getReverseChronologicalTimeline
);

router.post(
  '/',
  validateRequest({
    body: signUpUserBody,
  }),
  signUpUser
);

router.post(
  '/login',
  validateRequest({
    body: logInUserBody,
  }),
  logInUser
);

router.get(
  '/:username/following',
  validateRequest({
    params: usernameSchema,
    query: getUserFollowingsQuery,
  }),
  getUserFollowings
);

router.get(
  '/:username/followers',
  validateRequest({
    params: usernameSchema,
    query: getUserFollowersQuery,
  }),
  getUserFollowers
);

router.get(
  '/:username/liked-chirps',
  validateRequest({
    params: usernameSchema,
    query: getLikedChirpsQuery,
  }),
  getLikedChirps
);

export default router;
