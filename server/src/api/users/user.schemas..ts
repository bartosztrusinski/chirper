import { object, number } from 'zod';
import { createInputSchema } from '../../utils/zodHelper.utils';
import config from '../../config/request.config';
import {
  userFields,
  limit,
  ids,
  page,
  query,
  sinceId,
  followedOnly,
  usernameInput,
  objectId,
  usernameObject,
  chirpIdObject,
} from '../../schemas';

const username = usernameInput
  .min(
    config.user.username.min,
    `Username must be at least ${config.user.username.min} characters`
  )
  .max(
    config.user.username.max,
    `Username cannot exceed ${config.user.username.max} characters`
  )
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username must only contain letters, numbers, and underscores'
  );

const emailInput = createInputSchema('email');

const email = emailInput.regex(
  /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  'Please enter a valid email address'
);

const passwordInput = createInputSchema('password');

const password = passwordInput
  .min(
    config.user.password.min,
    `Password must be at least ${config.user.password.min} characters`
  )
  .max(
    config.user.password.max,
    `Password cannot exceed ${config.user.password.max} characters`
  )
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[^\s<>]*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
  );

const name = createInputSchema('name')
  .min(1, 'Name cannot be empty')
  .max(
    config.user.name.max,
    `Profile name cannot exceed ${config.user.name.max} characters`
  )
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

const bio = createInputSchema('bio')
  .min(1, 'Description cannot be empty')
  .max(
    config.user.bio.max,
    `Description cannot exceed ${config.user.bio.max} characters`
  )
  .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
  .optional();

const location = createInputSchema('location')
  .min(1, 'Location cannot be empty')
  .max(
    config.user.location.max,
    `Location cannot exceed ${config.user.location.max} characters`
  )
  .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
  .optional();

const website = createInputSchema('website')
  .max(
    config.user.website.max,
    `Website URL cannot exceed ${config.user.website.max} characters`
  )
  .regex(
    /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
    'Website URL must be valid'
  )
  .optional();

const picture = createInputSchema('picture')
  .min(1, 'Picture cannot be empty')
  .optional();

const header = createInputSchema('header')
  .min(1, 'Header cannot be empty')
  .optional();

const profile = object({
  name,
  bio,
  location,
  website,
  picture,
  header,
});

const metrics = object({
  chirpCount: number().int().min(0).default(0),
  likedChirpCount: number().int().min(0).default(0),
  followedCount: number().int().min(0).default(0),
  followingCount: number().int().min(0).default(0),
});

const user = object({
  username,
  email,
  password,
  profile,
  metrics,
});

const findMany = object({
  query: object({ ids, userFields }),
});

const findOne = object({
  params: usernameObject,
  query: object({ userFields }),
});

const exists = object({
  query: object({
    username: usernameInput.optional(),
    email: emailInput.optional(),
  }),
});

const findCurrentOne = object({
  currentUserId: objectId,
  query: object({ userFields }),
});

const searchMany = object({
  currentUserId: objectId.optional(),
  query: object({
    query,
    followedOnly,
    userFields,
    limit,
    page,
  }),
});

const findManyLiking = object({
  params: chirpIdObject,
  query: object({ sinceId, userFields, limit }),
});

const findManyFollowed = object({
  params: usernameObject,
  query: object({ userIds: ids, sinceId, userFields, limit }),
});

const findManyFollowing = object({
  params: usernameObject,
  query: object({ userIds: ids, sinceId, userFields, limit }),
});

const signUp = object({
  body: object({ username, email, password, name }),
});

const logIn = object({
  body: object({
    login: createInputSchema('login'),
    password: passwordInput,
  }),
});

const updateProfile = object({
  currentUserId: objectId,
  body: profile,
});

const updatePassword = object({
  currentUserId: objectId,
  body: object({
    password: createInputSchema('current password'),
    newPassword: password,
  }),
});

const updateUsername = object({
  currentUserId: objectId,
  body: object({
    password: passwordInput,
    newUsername: username,
  }),
});

const updateEmail = object({
  currentUserId: objectId,
  body: object({
    password: passwordInput,
    newEmail: email,
  }),
});

const deleteOne = object({
  currentUserId: objectId,
  body: object({ password: passwordInput }),
});

export {
  user,
  findMany,
  findOne,
  findCurrentOne,
  searchMany,
  exists,
  findManyLiking,
  findManyFollowed,
  findManyFollowing,
  signUp,
  logIn,
  updateProfile,
  updatePassword,
  updateUsername,
  updateEmail,
  deleteOne,
};
