import { z } from 'zod';
import config from '../../config/request';
import {
  userFields,
  limit,
  ids,
  page,
  query,
  sinceId,
  followedOnly,
  usernameInput,
} from '../../schemas/request';
import { createInputSchema } from '../../utils/zodFunctions';

const passwordInput = createInputSchema('password');

export const password = passwordInput
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

export const email = createInputSchema('email').regex(
  /^([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  'Please enter a valid email address'
);

export const username = usernameInput
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

export const name = createInputSchema('name')
  .min(1, 'Name cannot be empty')
  .max(
    config.user.name.max,
    `Profile name cannot exceed ${config.user.name.max} characters`
  )
  .regex(/^[^<>]*$/, 'Profile name cannot include invalid characters');

export const bio = createInputSchema('bio')
  .min(1, 'Description cannot be empty')
  .max(
    config.user.bio.max,
    `Description cannot exceed ${config.user.bio.max} characters`
  )
  .regex(/^[^<>]*$/, 'Description cannot include invalid characters')
  .optional();

export const location = createInputSchema('location')
  .min(1, 'Location cannot be empty')
  .max(
    config.user.location.max,
    `Location cannot exceed ${config.user.location.max} characters`
  )
  .regex(/^[^<>]*$/, 'Location cannot include invalid characters')
  .optional();

export const website = createInputSchema('website')
  .max(
    config.user.website.max,
    `Website URL cannot exceed ${config.user.website.max} characters`
  )
  .regex(
    /^(https?:\/\/)?(www.)?([a-z0-9]+\.)+[a-zA-Z]{2,}\/?(\/[a-zA-Z0-9#-_]+\/?)*$/,
    'Website URL must be valid'
  )
  .optional();

export const picture = createInputSchema('picture')
  .min(1, 'Picture cannot be empty')
  .optional();

export const header = createInputSchema('header')
  .min(1, 'Header cannot be empty')
  .optional();

export const profile = z.object({
  name,
  bio,
  location,
  website,
  picture,
  header,
});

export const metrics = z.object({
  chirpCount: z.number().int().min(0).default(0),
  likedChirpCount: z.number().int().min(0).default(0),
  followingCount: z.number().int().min(0).default(0),
  followersCount: z.number().int().min(0).default(0),
});

export const user = z.object({
  username,
  email,
  password,
  profile,
  metrics,
});

export const findMany = z.object({ ids, userFields });

export const findOne = z.object({ userFields });

export const searchMany = z.object({
  query,
  followedOnly,
  userFields,
  limit,
  page,
});

export const findManyLiking = z.object({ sinceId, userFields, limit });

const findUsersFromFollows = z.object({ sinceId, userFields, limit });

export const findManyFollowed = findUsersFromFollows;
export const findManyFollowing = findUsersFromFollows;

export const signUp = z.object({ username, email, password, name });

export const logIn = z.object({
  login: createInputSchema('login'),
  password: passwordInput,
});

export const updateProfile = profile;

export const updatePassword = z.object({
  password: createInputSchema('current password'),
  newPassword: password,
});

export const updateUsername = z.object({
  password: passwordInput,
  newUsername: username,
});

export const updateEmail = z.object({
  password: passwordInput,
  newEmail: email,
});

export const deleteOne = z.object({ password: passwordInput });
